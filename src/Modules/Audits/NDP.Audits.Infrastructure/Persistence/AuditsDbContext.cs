using Microsoft.EntityFrameworkCore;
using NDP.Audits.Domain.Entities;

namespace NDP.Audits.Infrastructure.Persistence;

public class AuditsDbContext : DbContext
{
    public AuditsDbContext(DbContextOptions<AuditsDbContext> options) : base(options)
    {
    }

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLogs");
            entity.HasKey(e => e.Id);
            
            entity.HasIndex(e => e.AuditDate);
            entity.HasIndex(e => e.UserName);
            entity.HasIndex(e => e.EntityName);
            entity.HasIndex(e => e.Action);
        });
    }
}
