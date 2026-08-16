using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Audits.Domain.Entities;
using NDP.Audits.Infrastructure.Persistence;
using NDP.Audits.Infrastructure.Persistence.Repositories;
using NDP.Audits.Infrastructure.Services;
using Xunit;

namespace NDP.Audits.Tests;

public class AuditServiceTests
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

    [Fact]
    public async Task LogAsync_ShouldAddAuditLog()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        var service = new AuditService(repository);

        // Act
        await service.LogAsync(
            userId: 1,
            userName: "testuser",
            entityId: 100,
            entityName: "Book",
            action: "Add",
            changes: "{}",
            ip: "127.0.0.1");

        // Assert
        var logs = await repository.GetRangeAsync(0, 10);
        Assert.Single(logs);
    }

    [Fact]
    public async Task LogAsync_ShouldSetCorrectValues()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        var service = new AuditService(repository);

        // Act
        await service.LogAsync(
            userId: 1,
            userName: "testuser",
            entityId: 100,
            entityName: "Book",
            action: "Edit",
            changes: "{\"title\":\"Updated\"}",
            ip: "192.168.1.1");

        // Assert
        var log = (await repository.GetRangeAsync(0, 10)).First();
        Assert.Equal(1, log.UserId);
        Assert.Equal("testuser", log.UserName);
        Assert.Equal(100, log.EntityId);
        Assert.Equal("Book", log.EntityName);
        Assert.Equal("Edit", log.Action);
        Assert.Equal("192.168.1.1", log.IP);
    }

    [Fact]
    public async Task LogAsync_ShouldLogMultipleEntries()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new AuditLogRepository(context);
        var service = new AuditService(repository);

        // Act
        for (int i = 0; i < 3; i++)
        {
            await service.LogAsync(
                userId: i + 1,
                userName: $"user{i}",
                entityId: i,
                entityName: "Book",
                action: "Add",
                changes: "{}",
                ip: "127.0.0.1");
        }

        // Assert
        var logs = await repository.GetRangeAsync(0, 10);
        Assert.Equal(3, logs.Count());
    }
}
