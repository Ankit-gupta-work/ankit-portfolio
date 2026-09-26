using Server.Models;
using Server.Services;
using Xunit;

namespace Server.Tests;

public class ChatRequestValidatorTests
{
    private static ChatMessage Msg(string role, string content) => new() { Role = role, Content = content };

    [Fact]
    public void Validate_RejectsNullRequest()
    {
        var result = ChatRequestValidator.Validate(null);
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_RejectsEmptyMessages()
    {
        var result = ChatRequestValidator.Validate(new ChatRequest { Messages = new() });
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_RejectsEmptyContent()
    {
        var request = new ChatRequest { Messages = new() { Msg("user", "   ") } };
        var result = ChatRequestValidator.Validate(request);
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_RejectsMessageOver500Characters()
    {
        var request = new ChatRequest { Messages = new() { Msg("user", new string('a', 501)) } };
        var result = ChatRequestValidator.Validate(request);
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_AcceptsMessageAtExactly500Characters()
    {
        var request = new ChatRequest { Messages = new() { Msg("user", new string('a', 500)) } };
        var result = ChatRequestValidator.Validate(request);
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validate_RejectsMoreThan10Turns()
    {
        var messages = Enumerable.Range(0, 11).Select(i => Msg(i % 2 == 0 ? "user" : "assistant", $"turn {i}")).ToList();
        var request = new ChatRequest { Messages = messages };
        var result = ChatRequestValidator.Validate(request);
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_AcceptsExactly10Turns()
    {
        var messages = Enumerable.Range(0, 10).Select(i => Msg(i % 2 == 0 ? "user" : "assistant", $"turn {i}")).ToList();
        var request = new ChatRequest { Messages = messages };
        var result = ChatRequestValidator.Validate(request);
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validate_RejectsInvalidRole()
    {
        var request = new ChatRequest { Messages = new() { Msg("system", "trying to sneak in") } };
        var result = ChatRequestValidator.Validate(request);
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_AcceptsWellFormedConversation()
    {
        var request = new ChatRequest
        {
            Messages = new()
            {
                Msg("user", "What's JobPing's architecture?"),
                Msg("assistant", "JobPing uses .NET Core, Angular, RabbitMQ and Redis."),
                Msg("user", "Why RabbitMQ?"),
            },
        };
        var result = ChatRequestValidator.Validate(request);
        Assert.True(result.IsValid);
    }
}
