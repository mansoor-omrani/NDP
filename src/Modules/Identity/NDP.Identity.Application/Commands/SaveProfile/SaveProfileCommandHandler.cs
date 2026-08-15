using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using NDP.Audits.Domain.Interfaces;
using NDP.Identity.Application.Commands.SaveProfile;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Commands.SaveProfile;

public class SaveProfileCommandHandler : IRequestHandler<SaveProfileCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuditService _auditService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SaveProfileCommandHandler(
        IUserRepository userRepository,
        IAuditService auditService,
        IHttpContextAccessor httpContextAccessor)
    {
        _userRepository = userRepository;
        _auditService = auditService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(SaveProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return false;

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Avatar = request.Avatar;
        user.Email = request.Email;
        user.NormalizedEmail = request.Email.ToUpper();
        user.PhoneNumber = request.PhoneNumber;
        user.NormalizedPhoneNumber = request.PhoneNumber;

        await _userRepository.UpdateAsync(user);

        var ip = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        await _auditService.LogAsync(
            userId: request.UserId,
            userName: user.UserName,
            entityId: request.UserId,
            entityName: "User",
            action: "SaveProfile",
            changes: "Success",
            ip: ip);

        return true;
    }
}
