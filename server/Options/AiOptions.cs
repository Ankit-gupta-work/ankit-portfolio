namespace Server.Options;

public class AiOptions
{
    public const string RequiredBaseUrlVar = "AI_BASE_URL";
    public const string RequiredApiKeyVar = "AI_API_KEY";
    public const string RequiredModelVar = "AI_MODEL";

    public string BaseUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int MaxTokens { get; set; } = 400;
    public double Temperature { get; set; } = 0.3;
    public string AllowedOrigins { get; set; } = "http://localhost:4200,http://localhost:4201";
    public string? RedisUrl { get; set; }
    public int RateLimitPerHour { get; set; } = 15;

    public string[] AllowedOriginsArray =>
        AllowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    /// <summary>Returns the name of the first missing required variable, or null if all are present.</summary>
    public string? FindMissingRequiredVariable()
    {
        if (string.IsNullOrWhiteSpace(BaseUrl)) return RequiredBaseUrlVar;
        if (string.IsNullOrWhiteSpace(ApiKey)) return RequiredApiKeyVar;
        if (string.IsNullOrWhiteSpace(Model)) return RequiredModelVar;
        return null;
    }

    public static AiOptions FromEnvironment(IConfiguration configuration)
    {
        return new AiOptions
        {
            BaseUrl = configuration[RequiredBaseUrlVar] ?? string.Empty,
            ApiKey = configuration[RequiredApiKeyVar] ?? string.Empty,
            Model = configuration[RequiredModelVar] ?? string.Empty,
            MaxTokens = TryParseInt(configuration["AI_MAX_TOKENS"], 400),
            Temperature = TryParseDouble(configuration["AI_TEMPERATURE"], 0.3),
            AllowedOrigins = configuration["ALLOWED_ORIGINS"] ?? "http://localhost:4200,http://localhost:4201",
            RedisUrl = configuration["REDIS_URL"],
            RateLimitPerHour = TryParseInt(configuration["RATE_LIMIT_PER_HOUR"], 15),
        };
    }

    private static int TryParseInt(string? value, int fallback) =>
        int.TryParse(value, out var parsed) ? parsed : fallback;

    private static double TryParseDouble(string? value, double fallback) =>
        double.TryParse(value, System.Globalization.CultureInfo.InvariantCulture, out var parsed) ? parsed : fallback;
}
