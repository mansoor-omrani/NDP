using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Books.Domain.Entities;
using NDP.Books.Infrastructure.Persistence;
using NDP.Books.Infrastructure.Persistence.Repositories;
using Xunit;

namespace NDP.Books.Tests;

public class BookRepositoryTests
{
    private BooksDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<BooksDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;
            
        var context = new BooksDbContext(options);
        context.Database.OpenConnection();
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task AddAsync_ShouldAddBook()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new BookRepository(context);
        var book = new Book
        {
            Title = "Test Book",
            Author = "Test Author",
            Publisher = "Test Publisher",
            PublishedYear = "2024",
            Genre = "Test",
            CreatedBy = 1,
            CreatedDate = DateTime.UtcNow
        };

        // Act
        var result = await repository.AddAsync(book);

        // Assert
        Assert.True(result.BookId > 0);
        Assert.Equal("Test Book", result.Title);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnBook()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new BookRepository(context);
        var book = new Book
        {
            Title = "Test Book",
            Author = "Test Author",
            CreatedBy = 1,
            CreatedDate = DateTime.UtcNow
        };
        await repository.AddAsync(book);

        // Act
        var result = await repository.GetByIdAsync(book.BookId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Book", result.Title);
    }

    [Fact]
    public async Task SoftDeleteAsync_ShouldMarkAsDeleted()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new BookRepository(context);
        var book = new Book
        {
            Title = "Test Book",
            Author = "Test Author",
            CreatedBy = 1,
            CreatedDate = DateTime.UtcNow
        };
        await repository.AddAsync(book);

        // Act
        await repository.SoftDeleteAsync(book.BookId);

        // Assert
        var deletedBook = await repository.GetByIdAsync(book.BookId, true);
        Assert.True(deletedBook.IsDeleted);
    }

    [Fact]
    public async Task RestoreAsync_ShouldUnmarkDeleted()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new BookRepository(context);
        var book = new Book
        {
            Title = "Test Book",
            Author = "Test Author",
            CreatedBy = 1,
            CreatedDate = DateTime.UtcNow,
            IsDeleted = true
        };
        await repository.AddAsync(book);

        // Act
        await repository.RestoreAsync(book.BookId);

        // Assert
        var restoredBook = await repository.GetByIdAsync(book.BookId, true);
        Assert.False(restoredBook.IsDeleted);
    }

    [Fact]
    public async Task GetRangeAsync_ShouldFilterBySearchTerm()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new BookRepository(context);
        
        var book1 = new Book { Title = "C# Programming", Author = "John", CreatedBy = 1, CreatedDate = DateTime.UtcNow };
        var book2 = new Book { Title = "Java Programming", Author = "Jane", CreatedBy = 1, CreatedDate = DateTime.UtcNow };
        
        await repository.AddAsync(book1);
        await repository.AddAsync(book2);

        // Act
        var result = await repository.GetRangeAsync(
            0, 
            10, 
            b => b.Title.Contains("C#"));

        // Assert
        Assert.Single(result);
        Assert.Equal("C# Programming", result.First().Title);
    }
}
