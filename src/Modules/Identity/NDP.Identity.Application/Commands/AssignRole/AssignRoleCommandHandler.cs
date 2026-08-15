using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Identity.Application.Commands.AssignRole;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Commands.AssignRole;

public class AssignRoleCommandHandler : IRequestHandler<AssignRoleCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AssignRoleCommandHandler(
        IUserRepository userRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _userRepository = userRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(AssignRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return false;

        if (request.RoleIds.Any())
        {
            await _userRepository.AssignRolesAsync(request.UserId, request.RoleIds);
        }
        else
        {
            await _userRepository.RemoveAllRolesAsync(request.UserId);
        }

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.AssignedBy,
            userName: _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Unknown",
            entityId: request.UserId,
            entityName: "User",
            action: "AssignRole",
            changes: $"RoleIds: {string.Join(",", request.RoleIds)}",
            ip: ip);

        return true;
    }
}
