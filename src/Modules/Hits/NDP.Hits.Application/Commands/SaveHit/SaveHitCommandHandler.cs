using System.Threading;
using System.Threading.Tasks;
using MediatR;
using NDP.Hits.Application.Commands.SaveHit;
using NDP.Hits.Domain.Interfaces;

namespace NDP.Hits.Application.Commands.SaveHit;

public class SaveHitCommandHandler : IRequestHandler<SaveHitCommand, bool>
{
    private readonly IHitService _hitService;

    public SaveHitCommandHandler(IHitService hitService)
    {
        _hitService = hitService;
    }

    public async Task<bool> Handle(SaveHitCommand request, CancellationToken cancellationToken)
    {
        await _hitService.SaveHitAsync(request.UserId, request.EntityName, request.EntityId);
        return true;
    }
}
