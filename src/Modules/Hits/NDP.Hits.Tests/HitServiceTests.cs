using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Hits.Infrastructure.Persistence;
using NDP.Hits.Infrastructure.Persistence.Repositories;
using NDP.Hits.Infrastructure.Services;
using Xunit;

namespace NDP.Hits.Tests;

public class HitServiceTests
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
    public async Task SaveHitAsync_ShouldAddNewHit()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        var service = new HitService(repository);

        // Act
        await service.SaveHitAsync(null, "Book", 1);

        // Assert
        var hits = await service.GetHitsAsync("Book", 1);
        Assert.Equal(1, hits);
    }

    [Fact]
    public async Task SaveHitAsync_ShouldIncrementExistingHit()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        var service = new HitService(repository);

        // Act
        await service.SaveHitAsync(null, "Book", 1);
        await service.SaveHitAsync(null, "Book", 1);
        await service.SaveHitAsync(null, "Book", 1);

        // Assert
        var hits = await service.GetHitsAsync("Book", 1);
        Assert.Equal(3, hits);
    }

    [Fact]
    public async Task SaveHitAsync_ShouldTrackDifferentUsers()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        var service = new HitService(repository);

        // Act
        await service.SaveHitAsync(null, "Book", 1); // Anonymous
        await service.SaveHitAsync(1, "Book", 1);     // User 1
        await service.SaveHitAsync(2, "Book", 1);     // User 2

        // Assert
        var totalHits = await service.GetHitsAsync("Book", 1);
        Assert.Equal(3, totalHits);
    }

    [Fact]
    public async Task GetHitsAsync_ShouldReturnZero_WhenNoHits()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new HitLogRepository(context);
        var service = new HitService(repository);

        // Act
        var hits = await service.GetHitsAsync("Book", 999);

        // Assert
        Assert.Equal(0, hits);
    }
}
