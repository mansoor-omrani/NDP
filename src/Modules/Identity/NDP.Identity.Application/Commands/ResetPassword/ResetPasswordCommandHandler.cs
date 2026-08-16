using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using NDP.Identity.Application.Commands.ResetPassword;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Commands.ResetPassword;

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, bool>
{
    private readonly IUserRepository _userRepository;

    public ResetPasswordCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return false;

        if (user.EmailConfirmationCode != request.Code)
        {
            return false;
        }

        if (user.EmailConfirmationExpiryTime.HasValue && 
            user.EmailConfirmationExpiryTime.Value < DateTimeOffset.UtcNow)
        {
            return false;
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _userRepository.UpdatePasswordAsync(request.UserId, passwordHash);

        user.EmailConfirmationCode = null;
        user.EmailConfirmationExpiryTime = null;
        await _userRepository.UpdateAsync(user);

        return true;
    }
}
