using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Books.Application.Commands.RestoreBook;
using NDP.Books.Domain.Interfaces;

namespace NDP.Books.Application.Commands.RestoreBook;

public class RestoreBookCommandHandler : IRequestHandler<RestoreBookCommand, bool>
{
    private readonly IBookRepository _bookRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RestoreBookCommandHandler(
        IBookRepository bookRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _bookRepository = bookRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(RestoreBookCommand request, CancellationToken cancellationToken)
    {
        var exists = await _bookRepository.ExistsAsync(request.BookId, true);
        if (!exists) return false;

        await _bookRepository.RestoreAsync(request.BookId);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.UserId,
            userName: _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Unknown",
            entityId: request.BookId,
            entityName: "Book",
            action: "Restore",
            changes: "{}",
            ip: ip);

        return true;
    }
}
