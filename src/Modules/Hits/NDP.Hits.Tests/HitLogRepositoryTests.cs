using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Hits.Domain.Entities;
using NDP.Hits.Infrastructure.Persistence;
using NDP.Hits.Infrastructure.Persistence.Repositories;
using Xunit;

namespace NDP.Hits.Tests;

public class HitLogRepositoryTests
{
    private HitsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<HitsDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;
            
        var context = new HitsDbContext(options);
        context.Database.OpenConnection();
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task AddAsync_ShouldAddHitLog()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        var hitLog = new HitLog
        {
            UserId = null,
            EntityName = "Book",
            EntityId = 1,
            Hits = 1
        };

        // Act
        var result = await repository.AddAsync(hitLog);

        // Assert
        Assert.True(result.Id > 0);
        Assert.Equal(1, result.Hits);
    }

    [Fact]
    public async Task GetHitLogAsync_ShouldReturnHitLog()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        var hitLog = new HitLog
        {
            UserId = null,
            EntityName = "Book",
            EntityId = 1,
            Hits = 1
        };
        await repository.AddAsync(hitLog);

        // Act
        var result = await repository.GetHitLogAsync(null, "Book", 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Hits);
    }

    [Fact]
    public async Task GetHitLogAsync_ShouldReturnNull_WhenNotFound()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);

        // Act
        var result = await repository.GetHitLogAsync(null, "Book", 999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateHits()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        var hitLog = new HitLog
        {
            UserId = null,
            EntityName = "Book",
            EntityId = 1,
            Hits = 1
        };
        await repository.AddAsync(hitLog);

        // Act
        hitLog.Hits = 5;
        await repository.UpdateAsync(hitLog);

        // Assert
        var updated = await repository.GetHitLogAsync(null, "Book", 1);
        Assert.Equal(5, updated.Hits);
    }

    [Fact]
    public async Task GetTotalHitsAsync_ShouldSumAllHits()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        
        await repository.AddAsync(new HitLog { UserId = null, EntityName = "Book", EntityId = 1, Hits = 2 });
        await repository.AddAsync(new HitLog { UserId = 1, EntityName = "Book", EntityId = 1, Hits = 3 });
        await repository.AddAsync(new HitLog { UserId = 2, EntityName = "Book", EntityId = 1, Hits = 5 });

        // Act
        var totalHits = await repository.GetTotalHitsAsync("Book", 1);

        // Assert
        Assert.Equal(10, totalHits);
    }

    [Fact]
    public async Task GetTotalHitsAsync_ShouldReturnZero_WhenNoHits()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);

        // Act
        var totalHits = await repository.GetTotalHitsAsync("Book", 999);

        // Assert
        Assert.Equal(0, totalHits);
    }
}
