using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Books.Application.Commands.AddBook;
using NDP.Books.Domain.Entities;
using NDP.Books.Domain.Interfaces;

namespace NDP.Books.Application.Commands.AddBook;

public class AddBookCommandHandler : IRequestHandler<AddBookCommand, int>
{
    private readonly IBookRepository _bookRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AddBookCommandHandler(
        IBookRepository bookRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _bookRepository = bookRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<int> Handle(AddBookCommand request, CancellationToken cancellationToken)
    {
        var book = new Book
        {
            Title = request.Title,
            Author = request.Author,
            Publisher = request.Publisher,
            PublishedYear = request.PublishedYear,
            Genre = request.Genre,
            Photo = request.Photo,
            Description = request.Description,
            Url = request.Url,
            IsDeleted = false,
            CreatedBy = request.CreatedBy,
            CreatedDate = DateTime.UtcNow
        };

        var result = await _bookRepository.AddAsync(book);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.CreatedBy,
            userName: _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Unknown",
            entityId: result.BookId,
            entityName: "Book",
            action: "Add",
            changes: JsonSerializer.Serialize(book),
            ip: ip);

        return result.BookId;
    }
}
