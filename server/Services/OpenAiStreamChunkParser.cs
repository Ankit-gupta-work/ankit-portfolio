using System.Text.Json;

namespace Server.Services;

public record ParsedChunk(bool IsDone, string? DeltaText, int? PromptTokens, int? CompletionTokens);

/// <summary>Interprets a single raw "data:" payload from an OpenAI-compatible chat completions stream.</summary>
public static class OpenAiStreamChunkParser
{
    public static ParsedChunk Parse(string payload)
    {
        if (payload == "[DONE]")
        {
            return new ParsedChunk(true, null, null, null);
        }

        try
        {
            using var doc = JsonDocument.Parse(payload);
            var root = doc.RootElement;

            string? delta = null;
            if (root.TryGetProperty("choices", out var choices) &&
                choices.ValueKind == JsonValueKind.Array &&
                choices.GetArrayLength() > 0)
            {
                var first = choices[0];
                if (first.TryGetProperty("delta", out var deltaEl) &&
                    deltaEl.TryGetProperty("content", out var contentEl) &&
                    contentEl.ValueKind == JsonValueKind.String)
                {
                    delta = contentEl.GetString();
                }
            }

            int? promptTokens = null;
            int? completionTokens = null;
            if (root.TryGetProperty("usage", out var usage) && usage.ValueKind == JsonValueKind.Object)
            {
                if (usage.TryGetProperty("prompt_tokens", out var pt)) promptTokens = pt.GetInt32();
                if (usage.TryGetProperty("completion_tokens", out var ct)) completionTokens = ct.GetInt32();
            }

            return new ParsedChunk(false, delta, promptTokens, completionTokens);
        }
        catch (JsonException)
        {
            // Malformed/partial payload — treat as no-op rather than crashing the stream.
            return new ParsedChunk(false, null, null, null);
        }
    }
}
