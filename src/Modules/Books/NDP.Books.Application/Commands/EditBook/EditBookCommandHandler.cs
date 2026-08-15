using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Books.Application.Commands.EditBook;
using NDP.Books.Domain.Interfaces;

namespace NDP.Books.Application.Commands.EditBook;

public class EditBookCommandHandler : IRequestHandler<EditBookCommand, bool>
{
    private readonly IBookRepository _bookRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public EditBookCommandHandler(
        IBookRepository bookRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _bookRepository = bookRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(EditBookCommand request, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.GetByIdAsync(request.BookId);
        if (book == null) return false;

        var oldBook = JsonSerializer.Serialize(book);

        book.Title = request.Title;
        book.Author = request.Author;
        book.Publisher = request.Publisher;
        book.PublishedYear = request.PublishedYear;
        book.Genre = request.Genre;
        book.Photo = request.Photo;
        book.Description = request.Description;
        book.Url = request.Url;
        book.LastModifiedBy = request.ModifiedBy;
        book.LastModifiedDate = DateTime.UtcNow;

        await _bookRepository.UpdateAsync(book);

        var changes = JsonSerializer.Serialize(new { Old = oldBook, New = JsonSerializer.Serialize(book) });
        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.ModifiedBy,
            userName: _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Unknown",
            entityId: request.BookId,
            entityName: "Book",
            action: "Edit",
            changes: changes,
            ip: ip);

        return true;
    }
}
