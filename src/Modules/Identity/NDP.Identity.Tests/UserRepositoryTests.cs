using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Identity.Domain.Entities;
using NDP.Identity.Infrastructure.Persistence;
using NDP.Identity.Infrastructure.Persistence.Repositories;
using Xunit;

namespace NDP.Identity.Tests;

public class UserRepositoryTests
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

    [Fact]
    public async Task AddAsync_ShouldAddUser()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new UserRepository(context);
        var user = new User
        {
            UserName = "testuser",
            NormalizedUserName = "TESTUSER",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            Email = "test@example.com",
            NormalizedEmail = "TEST@EXAMPLE.COM"
        };

        // Act
        var result = await repository.AddAsync(user);

        // Assert
        Assert.True(result.Id > 0);
        Assert.Equal("testuser", result.UserName);
    }

    [Fact]
    public async Task GetByUsernameAsync_ShouldReturnUser()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new UserRepository(context);
        var user = new User
        {
            UserName = "testuser",
            NormalizedUserName = "TESTUSER",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString()
        };
        await repository.AddAsync(user);

        // Act
        var result = await repository.GetByUsernameAsync("testuser");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("testuser", result.UserName);
    }

    [Fact]
    public async Task GetByUsernameAsync_ShouldReturnNull_WhenUserNotFound()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new UserRepository(context);

        // Act
        var result = await repository.GetByUsernameAsync("nonexistent");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveUser()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new UserRepository(context);
        var user = new User
        {
            UserName = "testuser",
            NormalizedUserName = "TESTUSER",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString()
        };
        await repository.AddAsync(user);

        // Act
        await repository.DeleteAsync(user.Id);

        // Assert
        var deletedUser = await repository.GetByIdAsync(user.Id);
        Assert.Null(deletedUser);
    }

    [Fact]
    public async Task AssignRolesAsync_ShouldAssignRoles()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new UserRepository(context);
        
        var user = new User
        {
            UserName = "testuser",
            NormalizedUserName = "TESTUSER",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString()
        };
        await repository.AddAsync(user);

        var role = new Role { Name = "Administrator", NormalizedName = "ADMINISTRATOR" };
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Act
        await repository.AssignRolesAsync(user.Id, new List<int> { role.Id });

        // Assert
        var userRoles = await repository.GetUserRolesAsync(user.Id);
        Assert.Single(userRoles);
        Assert.Equal("Administrator", userRoles.First().Name);
    }
}
