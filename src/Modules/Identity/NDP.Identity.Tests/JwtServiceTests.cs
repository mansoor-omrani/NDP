using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using NDP.Identity.Domain.Configuration;
using NDP.Identity.Domain.Entities;
using NDP.Identity.Infrastructure.Services;
using Xunit;

namespace NDP.Identity.Tests;

public class JwtServiceTests
{
    private JwtSettings CreateJwtSettings()
    {
        return new JwtSettings
        {
            SecretKey = "test_secret_key_for_jwt_token_generation_123456789",
            Issuer = "TestIssuer",
            Audience = "TestAudience",
            ExpiryInDays = 365
        };
    }

    private JwtService CreateJwtService()
    {
        var settings = CreateJwtSettings();
        var options = Options.Create(settings);
        return new JwtService(options);
    }

    private User CreateUser()
    {
        return new User
        {
            Id = 1,
            UserName = "testuser",
            Email = "test@example.com",
            FirstName = "Test",
            LastName = "User"
        };
    }

    private List<Role> CreateRoles()
    {
        return new List<Role>
        {
            new Role { Id = 1, Name = "Administrator", NormalizedName = "ADMINISTRATOR" },
            new Role { Id = 2, Name = "Member", NormalizedName = "MEMBER" }
        };
    }

    [Fact]
    public void GenerateToken_ShouldReturnToken()
    {
        // Arrange
        var jwtService = CreateJwtService();
        var user = CreateUser();
        var roles = CreateRoles();

        // Act
        var token = jwtService.GenerateToken(user, roles);

        // Assert
        Assert.NotNull(token);
        Assert.NotEmpty(token);
    }

    [Fact]
    public void GenerateToken_ShouldContainUserClaims()
    {
        // Arrange
        var jwtService = CreateJwtService();
        var user = CreateUser();
        var roles = CreateRoles();

        // Act
        var token = jwtService.GenerateToken(user, roles);
        var principal = jwtService.ValidateToken(token);

        // Assert
        Assert.NotNull(principal);
        Assert.Equal("1", principal.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        Assert.Equal("testuser", principal.FindFirst(ClaimTypes.Name)?.Value);
        Assert.Equal("test@example.com", principal.FindFirst(ClaimTypes.Email)?.Value);
    }

    [Fact]
    public void GenerateToken_ShouldContainRoleClaims()
    {
        // Arrange
        var jwtService = CreateJwtService();
        var user = CreateUser();
        var roles = CreateRoles();

        // Act
        var token = jwtService.GenerateToken(user, roles);
        var principal = jwtService.ValidateToken(token);

        // Assert
        var roleClaims = principal.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        Assert.Contains("Administrator", roleClaims);
        Assert.Contains("Member", roleClaims);
    }

    [Fact]
    public void ValidateToken_ShouldReturnPrincipal_ForValidToken()
    {
        // Arrange
        var jwtService = CreateJwtService();
        var user = CreateUser();
        var roles = CreateRoles();
        var token = jwtService.GenerateToken(user, roles);

        // Act
        var principal = jwtService.ValidateToken(token);

        // Assert
        Assert.NotNull(principal);
    }

    [Fact]
    public void ValidateToken_ShouldReturnNull_ForInvalidToken()
    {
        // Arrange
        var jwtService = CreateJwtService();

        // Act
        var principal = jwtService.ValidateToken("invalid_token");

        // Assert
        Assert.Null(principal);
    }

    [Fact]
    public void GenerateToken_ShouldSetExpiry()
    {
        // Arrange
        var jwtService = CreateJwtService();
        var user = CreateUser();
        var roles = CreateRoles();

        // Act
        var token = jwtService.GenerateToken(user, roles);
        var principal = jwtService.ValidateToken(token);

        // Assert
        var expiryClaim = principal.FindFirst("exp")?.Value;
        Assert.NotNull(expiryClaim);
        
        var expiryDate = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expiryClaim)).UtcDateTime;
        Assert.True(expiryDate > DateTime.UtcNow);
    }
}
