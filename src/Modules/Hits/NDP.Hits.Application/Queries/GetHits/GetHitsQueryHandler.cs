using System.Threading;
using System.Threading.Tasks;
using MediatR;
using NDP.Hits.Application.Queries.GetHits;
using NDP.Hits.Domain.Interfaces;

namespace NDP.Hits.Application.Queries.GetHits;

public class GetHitsQueryHandler : IRequestHandler<GetHitsQuery, int>
{
    private readonly IHitService _hitService;

    public GetHitsQueryHandler(IHitService hitService)
    {
        _hitService = hitService;
    }

    public async Task<int> Handle(GetHitsQuery request, CancellationToken cancellationToken)
    {
        return await _hitService.GetHitsAsync(request.EntityName, request.EntityId);
    }
}
