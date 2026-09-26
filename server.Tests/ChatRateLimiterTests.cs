using Server.Services;
using Xunit;

namespace Server.Tests;

public class InMemoryFixedWindowRateLimiterTests
{
    [Fact]
    public async Task TryAcquireAsync_AllowsUpToLimit_ThenDenies()
    {
        var limiter = new InMemoryFixedWindowRateLimiter(permitLimit: 3);
        const string clientKey = "1.2.3.4";

        Assert.True(await limiter.TryAcquireAsync(clientKey));
        Assert.True(await limiter.TryAcquireAsync(clientKey));
        Assert.True(await limiter.TryAcquireAsync(clientKey));
        Assert.False(await limiter.TryAcquireAsync(clientKey));
    }

    [Fact]
    public async Task TryAcquireAsync_TracksDifferentClientsIndependently()
    {
        var limiter = new InMemoryFixedWindowRateLimiter(permitLimit: 1);

        Assert.True(await limiter.TryAcquireAsync("client-a"));
        Assert.False(await limiter.TryAcquireAsync("client-a"));
        Assert.True(await limiter.TryAcquireAsync("client-b"));
    }
}
