using System.Collections.Generic;
using MediatR;

namespace NDP.Identity.Application.Commands.AssignRole;

public record AssignRoleCommand : IRequest<bool>
{
    public int UserId { get; init; }
    public IEnumerable<int> RoleIds { get; init; } = new List<int>();
    public int AssignedBy { get; init; }
}
