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

        // TODO: بررسی کد بازیابی
        // if (user.EmailConfirmationCode != request.Code) return false;
        // if (user.EmailConfirmationExpiryTime < DateTimeOffset.UtcNow) return false;

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _userRepository.UpdatePasswordAsync(request.UserId, passwordHash);

        return true;
    }
}
