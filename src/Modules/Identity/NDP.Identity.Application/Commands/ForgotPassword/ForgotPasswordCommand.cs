using MediatR;

namespace NDP.Identity.Application.Commands.ForgotPassword;

public record ForgotPasswordCommand : IRequest<bool>
{
    public string EmailOrPhone { get; init; } = string.Empty;
}
