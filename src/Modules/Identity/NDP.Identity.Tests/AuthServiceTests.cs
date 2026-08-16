using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Identity.Domain.Entities;
using NDP.Identity.Infrastructure.Persistence;
using NDP.Identity.Infrastructure.Persistence.Repositories;
using Xunit;

namespace NDP.Identity.Tests;

public class AuthServiceTests
{
    private IdentityDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<IdentityDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;
            
        var context = new IdentityDbContext(options);
        context.Database.OpenConnection();
        context.Database.EnsureCreated();
        return context;
    }

    private async Task<User> CreateUserAsync(IdentityDbContext context, string username = "testuser", string password = "Test@123")
    {
        var user = new User
        {
            UserName = username,
            NormalizedUserName = username.ToUpper(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            Email = $"{username}@example.com",
            NormalizedEmail = $"{username}@EXAMPLE.COM",
            EmailConfirmed = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    [Fact]
    public async Task VerifyPassword_ShouldReturnTrue_ForCorrectPassword()
    {
        // Arrange
        using var context = CreateContext();
        var user = await CreateUserAsync(context);

        // Act
        var isValid = BCrypt.Net.BCrypt.Verify("Test@123", user.PasswordHash);

        // Assert
        Assert.True(isValid);
    }

    [Fact]
    public async Task VerifyPassword_ShouldReturnFalse_ForIncorrectPassword()
    {
        // Arrange
        using var context = CreateContext();
        var user = await CreateUserAsync(context);

        // Act
        var isValid = BCrypt.Net.BCrypt.Verify("WrongPassword", user.PasswordHash);

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public async Task GetByUsernameAsync_ShouldFindUser()
    {
        // Arrange
        using var context = CreateContext();
        await CreateUserAsync(context, "testuser");

        // Act
        var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == "testuser");

        // Assert
        Assert.NotNull(user);
        Assert.Equal("testuser", user.UserName);
    }

    [Fact]
    public async Task GetByUsernameAsync_ShouldNotFindNonexistentUser()
    {
        // Arrange
        using var context = CreateContext();

        // Act
        var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == "nonexistent");

        // Assert
        Assert.Null(user);
    }

    [Fact]
    public async Task UpdateLastLoginAsync_ShouldUpdateLastLogin()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new UserRepository(context);
        var user = await CreateUserAsync(context);
        var lastLogin = DateTime.UtcNow;

        // Act
        await repository.UpdateLastLoginAsync(user.Id, lastLogin);

        // Assert
        var updatedUser = await repository.GetByIdAsync(user.Id);
        Assert.NotNull(updatedUser.LastLogin);
        Assert.Equal(lastLogin.ToString("yyyy-MM-dd HH:mm"), updatedUser.LastLogin?.ToString("yyyy-MM-dd HH:mm"));
    }

    [Fact]
    public async Task ResetAccessFailedCountAsync_ShouldResetCount()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new UserRepository(context);
        var user = await CreateUserAsync(context);
        
        // Increment first
        await repository.IncrementAccessFailedCountAsync(user.Id);
        await repository.IncrementAccessFailedCountAsync(user.Id);
        await repository.IncrementAccessFailedCountAsync(user.Id);
        
        // Act
        await repository.ResetAccessFailedCountAsync(user.Id);

        // Assert
        var updatedUser = await repository.GetByIdAsync(user.Id);
        Assert.Equal(0, updatedUser.AccessFailedCount);
    }
}
