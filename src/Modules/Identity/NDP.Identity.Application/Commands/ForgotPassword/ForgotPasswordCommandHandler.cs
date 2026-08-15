using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using NDP.Identity.Application.Commands.ForgotPassword;
using NDP.Identity.Domain.Interfaces;
using NDP.Identity.Infrastructure.Services;

namespace NDP.Identity.Application.Commands.ForgotPassword;

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly EmailService _emailService;
    private readonly SmsService _smsService;

    public ForgotPasswordCommandHandler(
        IUserRepository userRepository,
        EmailService emailService,
        SmsService smsService)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _smsService = smsService;
    }

    public async Task<bool> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.EmailOrPhone);
        if (user == null)
        {
            user = await _userRepository.GetByPhoneNumberAsync(request.EmailOrPhone);
        }

        if (user == null) return false;

        var resetCode = GenerateResetCode();
        var resetLink = $"https://example.com/reset-password?code={resetCode}&userId={user.Id}";

        if (!string.IsNullOrEmpty(user.Email))
        {
            await _emailService.SendEmailAsync(user.Email, "Reset Password", $"Click here to reset your password: {resetLink}");
        }
        else if (!string.IsNullOrEmpty(user.PhoneNumber))
        {
            await _smsService.SendSmsAsync(user.PhoneNumber, $"Your reset code: {resetCode}");
        }

        return true;
    }

    private string GenerateResetCode()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}
