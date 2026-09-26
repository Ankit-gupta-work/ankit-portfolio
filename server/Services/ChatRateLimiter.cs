using System.Collections.Concurrent;
using System.Threading.RateLimiting;
using StackExchange.Redis;

namespace Server.Services;

public interface IChatRateLimiter
{
    Task<bool> TryAcquireAsync(string clientKey);
}

/// <summary>
/// In-memory fixed-window limiter built on ASP.NET Core's own System.Threading.RateLimiting
/// primitives — used with zero setup when no Redis instance is configured. Not shared across
/// multiple server instances; use <see cref="RedisFixedWindowRateLimiter"/> for that.
/// </summary>
public class InMemoryFixedWindowRateLimiter : IChatRateLimiter, IDisposable
{
    private readonly int _permitLimit;
    private readonly ConcurrentDictionary<string, FixedWindowRateLimiter> _limiters = new();

    public InMemoryFixedWindowRateLimiter(int permitLimit)
    {
        _permitLimit = permitLimit;
    }

    public Task<bool> TryAcquireAsync(string clientKey)
    {
        var limiter = _limiters.GetOrAdd(clientKey, _ => new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions
        {
            PermitLimit = _permitLimit,
            Window = TimeSpan.FromHours(1),
            QueueLimit = 0,
            AutoReplenishment = true,
        }));

        using var lease = limiter.AttemptAcquire();
        return Task.FromResult(lease.IsAcquired);
    }

    public void Dispose()
    {
        foreach (var limiter in _limiters.Values) limiter.Dispose();
    }
}

/// <summary>Redis-backed fixed-window counter (INCR + EXPIRE), shared across server instances.</summary>
public class RedisFixedWindowRateLimiter : IChatRateLimiter
{
    private readonly IConnectionMultiplexer _redis;
    private readonly int _permitLimit;

    public RedisFixedWindowRateLimiter(IConnectionMultiplexer redis, int permitLimit)
    {
        _redis = redis;
        _permitLimit = permitLimit;
    }

    public async Task<bool> TryAcquireAsync(string clientKey)
    {
        var db = _redis.GetDatabase();
        var windowBucket = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 3600;
        var key = $"ratelimit:{clientKey}:{windowBucket}";

        var count = await db.StringIncrementAsync(key);
        if (count == 1)
        {
            await db.KeyExpireAsync(key, TimeSpan.FromHours(1));
        }

        return count <= _permitLimit;
    }
}
