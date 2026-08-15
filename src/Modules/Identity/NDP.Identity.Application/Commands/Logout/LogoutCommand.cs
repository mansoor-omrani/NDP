using MediatR;

namespace NDP.Identity.Application.Commands.Logout;

public record LogoutCommand : IRequest<bool>
{
    public string Token { get; init; } = string.Empty;
    public int UserId { get; init; }
}
