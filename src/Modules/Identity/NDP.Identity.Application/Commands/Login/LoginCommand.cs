using MediatR;
using NDP.Identity.Application.DTOs;

namespace NDP.Identity.Application.Commands.Login;

public record LoginCommand : IRequest<AuthResponseDto?>
{
    public string UserName { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
