using System.Threading.Tasks;
using NDP.Identity.Infrastructure.Services;
using Xunit;

namespace NDP.Identity.Tests;

public class TokenBlacklistServiceTests
{
    [Fact]
    public async Task BlacklistTokenAsync_ShouldBlacklistToken()
    {
        // Arrange
        var service = new TokenBlacklistService();
        var token = "test_token_123";
        var userId = 1;

        // Act
        await service.BlacklistTokenAsync(token, userId);

        // Assert
        var isBlacklisted = await service.IsTokenBlacklistedAsync(token);
        Assert.True(isBlacklisted);
    }

    [Fact]
    public async Task IsTokenBlacklistedAsync_ShouldReturnFalse_ForNonBlacklistedToken()
    {
        // Arrange
        var service = new TokenBlacklistService();
        var token = "test_token_456";

        // Act
        var isBlacklisted = await service.IsTokenBlacklistedAsync(token);

        // Assert
        Assert.False(isBlacklisted);
    }

    [Fact]
    public async Task BlacklistTokenAsync_ShouldHandleMultipleTokens()
    {
        // Arrange
        var service = new TokenBlacklistService();
        var token1 = "token_1";
        var token2 = "token_2";
        var token3 = "token_3";

        // Act
        await service.BlacklistTokenAsync(token1, 1);
        await service.BlacklistTokenAsync(token2, 1);
        await service.BlacklistTokenAsync(token3, 2);

        // Assert
        Assert.True(await service.IsTokenBlacklistedAsync(token1));
        Assert.True(await service.IsTokenBlacklistedAsync(token2));
        Assert.True(await service.IsTokenBlacklistedAsync(token3));
    }

    [Fact]
    public async Task IsTokenBlacklistedAsync_ShouldReturnFalse_ForDifferentToken()
    {
        // Arrange
        var service = new TokenBlacklistService();
        var token = "original_token";
        var differentToken = "different_token";

        // Act
        await service.BlacklistTokenAsync(token, 1);

        // Assert
        var isBlacklisted = await service.IsTokenBlacklistedAsync(differentToken);
        Assert.False(isBlacklisted);
    }

    [Fact]
    public async Task BlacklistTokenAsync_ShouldBeIdempotent()
    {
        // Arrange
        var service = new TokenBlacklistService();
        var token = "idempotent_token";

        // Act
        await service.BlacklistTokenAsync(token, 1);
        await service.BlacklistTokenAsync(token, 1); // Same token again

        // Assert
        var isBlacklisted = await service.IsTokenBlacklistedAsync(token);
        Assert.True(isBlacklisted);
    }
}
