using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Identity.Application.Commands.Logout;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Commands.Logout;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly ITokenBlacklistService _tokenBlacklistService;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LogoutCommandHandler(
        ITokenBlacklistService tokenBlacklistService,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _tokenBlacklistService = tokenBlacklistService;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await _tokenBlacklistService.BlacklistTokenAsync(request.Token, request.UserId);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.UserId,
            userName: _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Unknown",
            entityId: request.UserId,
            entityName: "User",
            action: "Logout",
            changes: "Success",
            ip: ip);

        return true;
    }
}
