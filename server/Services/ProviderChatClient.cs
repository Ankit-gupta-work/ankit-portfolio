using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Server.Models;
using Server.Options;

namespace Server.Services;

public class ProviderException : Exception
{
    public ProviderException(string message, Exception? inner = null) : base(message, inner) { }
}

public interface IProviderChatClient
{
    IAsyncEnumerable<string> StreamCompletionAsync(
        string systemPrompt, IReadOnlyList<ChatMessage> messages, CancellationToken cancellationToken);
}

public class ProviderChatClient : IProviderChatClient
{
    private static readonly TimeSpan ProviderTimeout = TimeSpan.FromSeconds(30);

    private readonly HttpClient _httpClient;
    private readonly AiOptions _options;
    private readonly ILogger<ProviderChatClient> _logger;

    public ProviderChatClient(HttpClient httpClient, IOptions<AiOptions> options, ILogger<ProviderChatClient> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async IAsyncEnumerable<string> StreamCompletionAsync(
        string systemPrompt,
        IReadOnlyList<ChatMessage> messages,
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken)
    {
        using var timeoutCts = new CancellationTokenSource(ProviderTimeout);
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeoutCts.Token);

        var payload = new Dictionary<string, object?>
        {
            ["model"] = _options.Model,
            ["messages"] = BuildMessages(systemPrompt, messages),
            ["stream"] = true,
            ["max_tokens"] = _options.MaxTokens,
            ["temperature"] = _options.Temperature,
            ["stream_options"] = new { include_usage = true },
        };
        // Some reasoning-capable models (e.g. Nemotron, DeepSeek-R1 family) otherwise stream their
        // internal chain-of-thought as regular content. `reasoning` is an OpenRouter-only extension;
        // stricter providers (e.g. Groq) reject unknown fields with a 400, so only send it there.
        if (_options.BaseUrl.Contains("openrouter.ai", StringComparison.OrdinalIgnoreCase))
        {
            payload["reasoning"] = new { exclude = true };
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_options.BaseUrl.TrimEnd('/')}/chat/completions")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"),
        };
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _options.ApiKey);

        HttpResponseMessage response;
        try
        {
            response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, linkedCts.Token);
        }
        catch (OperationCanceledException) when (timeoutCts.IsCancellationRequested)
        {
            throw new ProviderException("Provider request timed out after 30s.");
        }
        catch (HttpRequestException ex)
        {
            throw new ProviderException("Provider request failed.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Provider returned {StatusCode}: {Body}", (int)response.StatusCode, body);
            throw new ProviderException($"Provider returned status {(int)response.StatusCode}.");
        }

        var parser = new SseLineParser();
        await using var stream = await response.Content.ReadAsStreamAsync(linkedCts.Token);
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream)
        {
            string? line;
            try
            {
                line = await reader.ReadLineAsync(linkedCts.Token);
            }
            catch (OperationCanceledException) when (timeoutCts.IsCancellationRequested)
            {
                throw new ProviderException("Provider stream timed out after 30s.");
            }

            if (line is null) break;

            foreach (var payloadLine in parser.Feed(line + "\n"))
            {
                var parsed = OpenAiStreamChunkParser.Parse(payloadLine);
                if (parsed.IsDone) yield break;

                if (parsed.PromptTokens is not null || parsed.CompletionTokens is not null)
                {
                    _logger.LogInformation(
                        "Provider usage: prompt_tokens={PromptTokens} completion_tokens={CompletionTokens}",
                        parsed.PromptTokens, parsed.CompletionTokens);
                }

                if (!string.IsNullOrEmpty(parsed.DeltaText))
                {
                    yield return parsed.DeltaText;
                }
            }
        }
    }

    private static List<object> BuildMessages(string systemPrompt, IReadOnlyList<ChatMessage> messages)
    {
        var result = new List<object> { new { role = "system", content = systemPrompt } };
        result.AddRange(messages.Select(m => (object)new { role = m.Role, content = m.Content }));
        return result;
    }
}
