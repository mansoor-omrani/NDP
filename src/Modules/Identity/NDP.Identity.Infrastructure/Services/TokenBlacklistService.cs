using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Infrastructure.Services;

public class TokenBlacklistService : ITokenBlacklistService
{
    private readonly ConcurrentDictionary<string, DateTime> _blacklistedTokens = new();
    private readonly ConcurrentDictionary<int, DateTime> _userTokenInvalidationTimes = new();

    public Task BlacklistTokenAsync(string token, int userId)
    {
        _blacklistedTokens.TryAdd(token, DateTime.UtcNow);
        _userTokenInvalidationTimes[userId] = DateTime.UtcNow;
        return Task.CompletedTask;
    }

    public Task<bool> IsTokenBlacklistedAsync(string token)
    {
        return Task.FromResult(_blacklistedTokens.ContainsKey(token));
    }
}
