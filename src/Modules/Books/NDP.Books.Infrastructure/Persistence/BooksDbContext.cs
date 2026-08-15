using Microsoft.EntityFrameworkCore;
using NDP.Books.Domain.Entities;

namespace NDP.Books.Infrastructure.Persistence;

public class BooksDbContext : DbContext
{
    public BooksDbContext(DbContextOptions<BooksDbContext> options) : base(options)
    {
    }

    public DbSet<Book> Books => Set<Book>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(entity =>
        {
            entity.ToTable("Books");
            entity.HasKey(e => e.BookId);
            
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Author).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Publisher).HasMaxLength(100);
            entity.Property(e => e.PublishedYear).HasMaxLength(4);
            entity.Property(e => e.Genre).HasMaxLength(50);
            entity.Property(e => e.Photo).HasMaxLength(500);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Url).HasMaxLength(500);
            
            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.Author);
            entity.HasIndex(e => e.IsDeleted);
        });
    }
}
