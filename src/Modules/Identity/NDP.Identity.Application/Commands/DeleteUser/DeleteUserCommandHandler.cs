using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Identity.Application.Commands.DeleteUser;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Commands.DeleteUser;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteUserCommandHandler(
        IUserRepository userRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _userRepository = userRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return false;

        if (user.UserName.ToLower() == "admin")
        {
            return false;
        }

        await _userRepository.DeleteAsync(request.UserId);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.DeletedBy,
            userName: _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Unknown",
            entityId: request.UserId,
            entityName: "User",
            action: "Delete",
            changes: $"Deleted user: {user.UserName}",
            ip: ip);

        return true;
    }
}
