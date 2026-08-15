using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Identity.Application.Commands.Register;
using NDP.Identity.Domain.Entities;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, int>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RegisterCommandHandler(
        IUserRepository userRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _userRepository = userRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<int> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = new User
        {
            UserName = request.UserName,
            NormalizedUserName = request.UserName.ToUpper(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            Email = request.Email,
            NormalizedEmail = request.Email.ToUpper(),
            PhoneNumber = request.PhoneNumber,
            NormalizedPhoneNumber = request.PhoneNumber,
            FirstName = request.FirstName,
            LastName = request.LastName,
            LockedOutEnabled = true,
            AccessFailedCount = 0
        };

        var result = await _userRepository.AddAsync(user);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: result.Id,
            userName: result.UserName,
            entityId: result.Id,
            entityName: "User",
            action: "Register",
            changes: "Success",
            ip: ip);

        return result.Id;
    }
}
