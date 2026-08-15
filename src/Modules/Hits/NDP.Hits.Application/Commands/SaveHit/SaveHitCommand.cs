using MediatR;

namespace NDP.Hits.Application.Commands.SaveHit;

public record SaveHitCommand : IRequest<bool>
{
    public int? UserId { get; init; }
    public string EntityName { get; init; } = string.Empty;
    public int EntityId { get; init; }
}
