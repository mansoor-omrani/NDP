using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Audits.Domain.Entities;
using NDP.Audits.Infrastructure.Persistence;
using NDP.Audits.Infrastructure.Persistence.Repositories;
using Xunit;

namespace NDP.Audits.Tests;

public class AuditLogRepositoryTests
{
    private AuditsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AuditsDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;
            
        var context = new AuditsDbContext(options);
        context.Database.OpenConnection();
        context.Database.EnsureCreated();
        return context;
    }

    private async Task<AuditLog> CreateAuditLogAsync(AuditsDbContext context, string action = "Add", string entityName = "Book")
    {
        var log = new AuditLog
        {
            AuditDate = DateTime.UtcNow,
            IP = "127.0.0.1",
            UserId = 1,
            UserName = "testuser",
            EntityId = 100,
            EntityName = entityName,
            Action = action,
            Changes = "{}"
        };
        context.AuditLogs.Add(log);
        await context.SaveChangesAsync();
        return log;
    }

    [Fact]
    public async Task AddAsync_ShouldAddAuditLog()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        var log = new AuditLog
        {
            AuditDate = DateTime.UtcNow,
            IP = "127.0.0.1",
            UserId = 1,
            UserName = "testuser",
            EntityId = 100,
            EntityName = "Book",
            Action = "Add",
            Changes = "{}"
        };

        // Act
        var result = await repository.AddAsync(log);

        // Assert
        Assert.True(result.Id > 0);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnAuditLog()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        var log = await CreateAuditLogAsync(context);

        // Act
        var result = await repository.GetByIdAsync(log.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Add", result.Action);
    }

    [Fact]
    public async Task GetRangeAsync_ShouldReturnAllLogs()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        await CreateAuditLogAsync(context, "Add");
        await CreateAuditLogAsync(context, "Edit");
        await CreateAuditLogAsync(context, "Delete");

        // Act
        var result = await repository.GetRangeAsync(0, 10);

        // Assert
        Assert.Equal(3, result.Count());
    }

    [Fact]
    public async Task GetRangeAsync_ShouldFilterByAction()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        await CreateAuditLogAsync(context, "Add");
        await CreateAuditLogAsync(context, "Edit");

        // Act
        var result = await repository.GetRangeAsync(0, 10, a => a.Action == "Edit");

        // Assert
        Assert.Single(result);
        Assert.Equal("Edit", result.First().Action);
    }

    [Fact]
    public async Task GetRangeAsync_ShouldFilterByEntityName()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        await CreateAuditLogAsync(context, "Add", "Book");
        await CreateAuditLogAsync(context, "Add", "User");

        // Act
        var result = await repository.GetRangeAsync(0, 10, a => a.EntityName == "User");

        // Assert
        Assert.Single(result);
        Assert.Equal("User", result.First().EntityName);
    }

    [Fact]
    public async Task CountAsync_ShouldReturnCorrectCount()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        await CreateAuditLogAsync(context, "Add");
        await CreateAuditLogAsync(context, "Edit");

        // Act
        var count = await repository.CountAsync();

        // Assert
        Assert.Equal(2, count);
    }

    [Fact]
    public async Task CountAsync_ShouldReturnFilteredCount()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        await CreateAuditLogAsync(context, "Add");
        await CreateAuditLogAsync(context, "Edit");
        await CreateAuditLogAsync(context, "Delete");

        // Act
        var count = await repository.CountAsync(a => a.Action != "Add");

        // Assert
        Assert.Equal(2, count);
    }
}
