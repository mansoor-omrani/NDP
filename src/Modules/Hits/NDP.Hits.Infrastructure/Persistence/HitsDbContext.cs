using Microsoft.EntityFrameworkCore;
using NDP.Hits.Domain.Entities;

namespace NDP.Hits.Infrastructure.Persistence;

public class HitsDbContext : DbContext
{
    public HitsDbContext(DbContextOptions<HitsDbContext> options) : base(options)
    {
    }

    public DbSet<HitLog> HitLogs => Set<HitLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HitLog>(entity =>
        {
            entity.ToTable("HitLogs");
            entity.HasKey(e => e.Id);
            
            entity.HasIndex(e => new { e.UserId, e.EntityName, e.EntityId }).IsUnique();
        });
    }
}
