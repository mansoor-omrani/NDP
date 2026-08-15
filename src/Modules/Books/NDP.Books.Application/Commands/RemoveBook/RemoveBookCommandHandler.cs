using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Books.Application.Commands.RemoveBook;
using NDP.Books.Domain.Interfaces;

namespace NDP.Books.Application.Commands.RemoveBook;

public class RemoveBookCommandHandler : IRequestHandler<RemoveBookCommand, bool>
{
    private readonly IBookRepository _bookRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RemoveBookCommandHandler(
        IBookRepository bookRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _bookRepository = bookRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(RemoveBookCommand request, CancellationToken cancellationToken)
    {
        var exists = await _bookRepository.ExistsAsync(request.BookId);
        if (!exists) return false;

        await _bookRepository.SoftDeleteAsync(request.BookId);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.UserId,
            userName: _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Unknown",
            entityId: request.BookId,
            entityName: "Book",
            action: "SoftDelete",
            changes: "{}",
            ip: ip);

        return true;
    }
}
