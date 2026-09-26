using System.Net;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Server.Models;
using Server.Options;
using Server.Services;
using Xunit;

namespace Server.Tests;

/// <summary>Fake HttpMessageHandler that returns a canned response — no real network calls.</summary>
public class FakeHttpMessageHandler : HttpMessageHandler
{
    private readonly Func<HttpRequestMessage, HttpResponseMessage> _responder;

    public HttpRequestMessage? LastRequest { get; private set; }
    public string? LastRequestBody { get; private set; }

    public FakeHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responder)
    {
        _responder = responder;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        LastRequest = request;
        LastRequestBody = request.Content is null ? null : await request.Content.ReadAsStringAsync(cancellationToken);
        return _responder(request);
    }
}

public class ProviderChatClientTests
{
    private static AiOptions Options() => new()
    {
        BaseUrl = "https://fake-provider.test/v1",
        ApiKey = "fake-key",
        Model = "fake-model",
    };

    [Fact]
    public async Task StreamCompletionAsync_YieldsDeltasFromSseStream()
    {
        const string sseBody =
            "data: {\"choices\":[{\"delta\":{\"content\":\"Hello\"}}]}\n\n" +
            "data: {\"choices\":[{\"delta\":{\"content\":\" world\"}}]}\n\n" +
            "data: [DONE]\n\n";

        var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(sseBody),
        });
        var httpClient = new HttpClient(handler);
        var client = new ProviderChatClient(httpClient, Microsoft.Extensions.Options.Options.Create(Options()), NullLogger<ProviderChatClient>.Instance);

        var deltas = new List<string>();
        await foreach (var delta in client.StreamCompletionAsync("system prompt", new List<ChatMessage> { new() { Role = "user", Content = "hi" } }, CancellationToken.None))
        {
            deltas.Add(delta);
        }

        Assert.Equal(new[] { "Hello", " world" }, deltas);
    }

    [Fact]
    public async Task StreamCompletionAsync_NeverLeaksApiKeyIntoRequestBody()
    {
        const string sseBody = "data: [DONE]\n\n";
        var handler = new FakeHttpMessageHandler(req => new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(sseBody),
        });
        var httpClient = new HttpClient(handler);
        var options = Options();
        var client = new ProviderChatClient(httpClient, Microsoft.Extensions.Options.Options.Create(options), NullLogger<ProviderChatClient>.Instance);

        await foreach (var _ in client.StreamCompletionAsync("system", new List<ChatMessage> { new() { Role = "user", Content = "hi" } }, CancellationToken.None))
        {
        }

        Assert.DoesNotContain(options.ApiKey, handler.LastRequestBody);
        Assert.Equal("Bearer", handler.LastRequest!.Headers.Authorization?.Scheme);
        Assert.Equal(options.ApiKey, handler.LastRequest.Headers.Authorization?.Parameter);
    }

    [Fact]
    public async Task StreamCompletionAsync_ThrowsProviderException_OnErrorStatus()
    {
        var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.Unauthorized)
        {
            Content = new StringContent("{\"error\":\"invalid api key\"}"),
        });
        var httpClient = new HttpClient(handler);
        var client = new ProviderChatClient(httpClient, Microsoft.Extensions.Options.Options.Create(Options()), NullLogger<ProviderChatClient>.Instance);

        await Assert.ThrowsAsync<ProviderException>(async () =>
        {
            await foreach (var _ in client.StreamCompletionAsync("system", new List<ChatMessage> { new() { Role = "user", Content = "hi" } }, CancellationToken.None))
            {
            }
        });
    }
}
