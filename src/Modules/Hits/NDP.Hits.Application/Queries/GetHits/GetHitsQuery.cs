using MediatR;

namespace NDP.Hits.Application.Queries.GetHits;

public record GetHitsQuery : IRequest<int>
{
    public string EntityName { get; init; } = string.Empty;
    public int EntityId { get; init; }
}
