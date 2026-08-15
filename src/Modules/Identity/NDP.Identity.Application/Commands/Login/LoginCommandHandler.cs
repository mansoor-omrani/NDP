using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Identity.Application.Commands.Login;
using NDP.Identity.Application.DTOs;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto?>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IJwtService jwtService,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<AuthResponseDto?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByUsernameAsync(request.UserName);
        if (user == null)
        {
            await LogAuditAsync(null, request.UserName, "Login", "Failed - User not found", "Unknown");
            return null;
        }

        // TODO: بررسی پسورد با BCrypt
        // if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        // {
        //     await _userRepository.IncrementAccessFailedCountAsync(user.Id);
        //     await LogAuditAsync(user.Id, user.UserName, "Login", "Failed - Invalid password", ip);
        //     return null;
        // }

        await _userRepository.UpdateLastLoginAsync(user.Id, DateTime.UtcNow);
        await _userRepository.ResetAccessFailedCountAsync(user.Id);

        var roles = await _userRepository.GetUserRolesAsync(user.Id);
        var token = _jwtService.GenerateToken(user, roles);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await LogAuditAsync(user.Id, user.UserName, "Login", "Success", ip);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles.Select(r => r.Name).ToList()
        };
    }

    private async Task LogAuditAsync(int? userId, string userName, string action, string changes, string ip)
    {
        await _auditService.LogAsync(
            userId: userId,
            userName: userName,
            entityId: userId ?? 0,
            entityName: "User",
            action: action,
            changes: changes,
            ip: ip);
    }
}
