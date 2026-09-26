using System.Text.Json.Serialization;

namespace Server.Models;

public class ChatMessage
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

public class ChatRequest
{
    [JsonPropertyName("messages")]
    public List<ChatMessage> Messages { get; set; } = new();
}

public record ValidationResult(bool IsValid, string? Error)
{
    public static readonly ValidationResult Ok = new(true, null);
    public static ValidationResult Fail(string error) => new(false, error);
}
