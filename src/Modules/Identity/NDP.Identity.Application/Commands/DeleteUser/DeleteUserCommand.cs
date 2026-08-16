using MediatR;

namespace NDP.Identity.Application.Commands.DeleteUser;

public record DeleteUserCommand : IRequest<bool>
{
    public int UserId { get; init; }
    public int DeletedBy { get; init; }
}
