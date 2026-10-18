using Microsoft.AspNetCore.HttpOverrides;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Server.Models;
using Server.Options;
using Server.Services;
using StackExchange.Redis;

// .env must be loaded into the process's environment variables *before* WebApplication.CreateBuilder
// runs — the configuration system snapshots environment variables during builder construction, so
// setting them afterward (even via builder.Configuration) would be too late for IConfiguration to see.
var aspnetEnv = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
if (string.Equals(aspnetEnv, "Development", StringComparison.OrdinalIgnoreCase))
{
    var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
    if (File.Exists(envPath))
    {
        DotNetEnv.Env.Load(envPath);
    }
}

var builder = WebApplication.CreateBuilder(args);

var aiOptions = AiOptions.FromEnvironment(builder.Configuration);
var missingVar = aiOptions.FindMissingRequiredVariable();
if (missingVar is not null)
{
    using var startupLoggerFactory = LoggerFactory.Create(b => b.AddConsole());
    startupLoggerFactory.CreateLogger("Startup").LogCritical(
        "Missing required environment variable {Variable}. Set AI_BASE_URL, AI_API_KEY and AI_MODEL before starting the API.",
        missingVar);
    Environment.Exit(1);
    return;
}

builder.Services.AddSingleton(Options.Create(aiOptions));
builder.Services.AddSingleton<IKnowledgeProfileLoader, KnowledgeProfileLoader>();
builder.Services.AddSingleton<IPromptBuilder, PromptBuilder>();
builder.Services.AddHttpClient<IProviderChatClient, ProviderChatClient>();

if (!string.IsNullOrWhiteSpace(aiOptions.RedisUrl))
{
    builder.Services.AddSingleton<IConnectionMultiplexer>(
        _ => ConnectionMultiplexer.Connect(aiOptions.RedisUrl));
    builder.Services.AddSingleton<IChatRateLimiter>(
        sp => new RedisFixedWindowRateLimiter(sp.GetRequiredService<IConnectionMultiplexer>(), aiOptions.RateLimitPerHour));
}
else
{
    builder.Services.AddSingleton<IChatRateLimiter>(
        _ => new InMemoryFixedWindowRateLimiter(aiOptions.RateLimitPerHour));
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(aiOptions.AllowedOriginsArray)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Behind a hosting proxy (Render etc.) the real visitor IP arrives in X-Forwarded-For; without this
// every visitor shares the proxy IP and therefore one rate-limit bucket.
var forwardedOptions = new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto };
forwardedOptions.KnownNetworks.Clear();
forwardedOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedOptions);

app.UseCors("Frontend");

app.MapGet("/api/health", (IOptions<AiOptions> options) =>
    Results.Ok(new { status = "ok", model = options.Value.Model }));

app.MapPost("/api/chat", async (
    HttpContext context,
    ChatRequest request,
    IPromptBuilder promptBuilder,
    IProviderChatClient providerClient,
    IChatRateLimiter rateLimiter,
    ILogger<Program> logger) =>
{
    var requestId = context.TraceIdentifier;
    var validation = ChatRequestValidator.Validate(request);
    if (!validation.IsValid)
    {
        return Results.Problem(validation.Error, statusCode: 400);
    }

    var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var allowed = await rateLimiter.TryAcquireAsync(clientIp);
    if (!allowed)
    {
        return Results.Json(
            new { error = "You've asked a lot — try again in a bit, or email Ankit at ankitjguptaforwork@gmail.com." },
            statusCode: 429);
    }

    context.Response.ContentType = "text/event-stream";
    context.Response.Headers.CacheControl = "no-cache";
    context.Response.Headers["X-Accel-Buffering"] = "no";

    var stopwatch = System.Diagnostics.Stopwatch.StartNew();
    var systemPrompt = promptBuilder.BuildSystemPrompt();

    try
    {
        await foreach (var delta in providerClient.StreamCompletionAsync(systemPrompt, request.Messages, context.RequestAborted))
        {
            var frame = $"data: {JsonSerializer.Serialize(delta)}\n\n";
            await context.Response.WriteAsync(frame, context.RequestAborted);
            await context.Response.Body.FlushAsync(context.RequestAborted);
        }
    }
    catch (ProviderException ex)
    {
        logger.LogError(ex, "Provider error for request {RequestId}", requestId);
        var fallback = "The assistant is taking a break — email Ankit directly at ankitjguptaforwork@gmail.com.";
        var frame = $"data: {JsonSerializer.Serialize(fallback)}\n\n";
        await context.Response.WriteAsync(frame, CancellationToken.None);
    }
    catch (OperationCanceledException)
    {
        // Client disconnected / aborted the stream — nothing more to write.
        return Results.Empty;
    }

    await context.Response.WriteAsync("data: [DONE]\n\n", CancellationToken.None);
    await context.Response.Body.FlushAsync(CancellationToken.None);

    stopwatch.Stop();
    logger.LogInformation("Chat request {RequestId} completed in {DurationMs}ms", requestId, stopwatch.ElapsedMilliseconds);

    return Results.Empty;
});

app.Run();

public partial class Program { }
