using Server.Models;

namespace Server.Services;

public static class ChatRequestValidator
{
    public const int MaxMessageLength = 500;
    public const int MaxTurns = 10;

    public static ValidationResult Validate(ChatRequest? request)
    {
        if (request is null || request.Messages is null || request.Messages.Count == 0)
        {
            return ValidationResult.Fail("Messages must not be empty.");
        }

        if (request.Messages.Count > MaxTurns)
        {
            return ValidationResult.Fail($"Conversation must not exceed {MaxTurns} turns.");
        }

        foreach (var message in request.Messages)
        {
            if (string.IsNullOrWhiteSpace(message.Content))
            {
                return ValidationResult.Fail("Message content must not be empty.");
            }

            if (message.Content.Length > MaxMessageLength)
            {
                return ValidationResult.Fail($"Message content must not exceed {MaxMessageLength} characters.");
            }

            if (message.Role != "user" && message.Role != "assistant")
            {
                return ValidationResult.Fail("Message role must be 'user' or 'assistant'.");
            }
        }

        return ValidationResult.Ok;
    }
}
