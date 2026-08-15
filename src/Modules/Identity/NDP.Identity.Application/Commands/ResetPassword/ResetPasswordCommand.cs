using MediatR;

namespace NDP.Identity.Application.Commands.ResetPassword;

public record ResetPasswordCommand : IRequest<bool>
{
    public int UserId { get; init; }
    public string Code { get; init; } = string.Empty;
    public string NewPassword { get; init; } = string.Empty;
}
