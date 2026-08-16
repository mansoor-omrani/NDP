using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Moq;
using NDP.Audits.Domain.Interfaces;
using NDP.Books.Application.Commands.AddBook;
using NDP.Books.Application.Commands.DeleteBook;
using NDP.Books.Application.Commands.RemoveBook;
using NDP.Books.Application.Commands.RestoreBook;
using NDP.Books.Domain.Entities;
using NDP.Books.Domain.Interfaces;
using Xunit;

namespace NDP.Books.Tests;

public class BookCommandHandlerTests
{
    private readonly Mock<IBookRepository> _bookRepositoryMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;

    public BookCommandHandlerTests()
    {
        _bookRepositoryMock = new Mock<IBookRepository>();
        _auditServiceMock = new Mock<IAuditService>();
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        
        var context = new DefaultHttpContext();
        context.Connection.RemoteIpAddress = System.Net.IPAddress.Parse("127.0.0.1");
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);
    }

    [Fact]
    public async Task AddBookCommandHandler_ShouldAddBook()
    {
        // Arrange
        var book = new Book
        {
            BookId = 1,
            Title = "Test Book",
            Author = "Test Author",
            CreatedBy = 1,
            CreatedDate = DateTime.UtcNow
        };
        
        _bookRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Book>()))
            .ReturnsAsync(book);
        
        var handler = new AddBookCommandHandler(
            _bookRepositoryMock.Object,
            _auditServiceMock.Object,
            _httpContextAccessorMock.Object);

        var command = new AddBookCommand
        {
            Title = "Test Book",
            Author = "Test Author",
            CreatedBy = 1
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(1, result);
        _bookRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Book>()), Times.Once);
        _auditServiceMock.Verify(x => x.LogAsync(
            It.IsAny<int?>(),
            It.IsAny<string>(),
            It.IsAny<int>(),
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task RemoveBookCommandHandler_ShouldSoftDeleteBook()
    {
        // Arrange
        _bookRepositoryMock.Setup(x => x.ExistsAsync(1, false))
            .ReturnsAsync(true);
        _bookRepositoryMock.Setup(x => x.SoftDeleteAsync(1))
            .Returns(Task.CompletedTask);
        
        var handler = new RemoveBookCommandHandler(
            _bookRepositoryMock.Object,
            _auditServiceMock.Object,
            _httpContextAccessorMock.Object);

        var command = new RemoveBookCommand
        {
            BookId = 1,
            UserId = 1
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);
        _bookRepositoryMock.Verify(x => x.SoftDeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task RemoveBookCommandHandler_ShouldReturnFalse_WhenBookNotFound()
    {
        // Arrange
        _bookRepositoryMock.Setup(x => x.ExistsAsync(1, false))
            .ReturnsAsync(false);
        
        var handler = new RemoveBookCommandHandler(
            _bookRepositoryMock.Object,
            _auditServiceMock.Object,
            _httpContextAccessorMock.Object);

        var command = new RemoveBookCommand
        {
            BookId = 1,
            UserId = 1
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result);
        _bookRepositoryMock.Verify(x => x.SoftDeleteAsync(1), Times.Never);
    }

    [Fact]
    public async Task RestoreBookCommandHandler_ShouldRestoreBook()
    {
        // Arrange
        _bookRepositoryMock.Setup(x => x.ExistsAsync(1, true))
            .ReturnsAsync(true);
        _bookRepositoryMock.Setup(x => x.RestoreAsync(1))
            .Returns(Task.CompletedTask);
        
        var handler = new RestoreBookCommandHandler(
            _bookRepositoryMock.Object,
            _auditServiceMock.Object,
            _httpContextAccessorMock.Object);

        var command = new RestoreBookCommand
        {
            BookId = 1,
            UserId = 1
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);
        _bookRepositoryMock.Verify(x => x.RestoreAsync(1), Times.Once);
    }

    [Fact]
    public async Task DeleteBookCommandHandler_ShouldHardDeleteBook()
    {
        // Arrange
        _bookRepositoryMock.Setup(x => x.ExistsAsync(1, true))
            .ReturnsAsync(true);
        _bookRepositoryMock.Setup(x => x.HardDeleteAsync(1))
            .Returns(Task.CompletedTask);
        
        var handler = new DeleteBookCommandHandler(
            _bookRepositoryMock.Object,
            _auditServiceMock.Object,
            _httpContextAccessorMock.Object);

        var command = new DeleteBookCommand
        {
            BookId = 1,
            UserId = 1
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);
        _bookRepositoryMock.Verify(x => x.HardDeleteAsync(1), Times.Once);
    }
}
