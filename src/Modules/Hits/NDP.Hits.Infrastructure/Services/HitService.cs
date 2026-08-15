using System.Threading.Tasks;
using NDP.Hits.Domain.Entities;
using NDP.Hits.Domain.Interfaces;

namespace NDP.Hits.Infrastructure.Services;

public class HitService : IHitService
{
    private readonly IHitLogRepository _hitLogRepository;

    public HitService(IHitLogRepository hitLogRepository)
    {
        _hitLogRepository = hitLogRepository;
    }

    public async Task SaveHitAsync(int? userId, string entityName, int entityId)
    {
        var existingHitLog = await _hitLogRepository.GetHitLogAsync(userId, entityName, entityId);

        if (existingHitLog != null)
        {
            existingHitLog.Hits++;
            await _hitLogRepository.UpdateAsync(existingHitLog);
        }
        else
        {
            var newHitLog = new HitLog
            {
                UserId = userId,
                EntityName = entityName,
                EntityId = entityId,
                Hits = 1
            };
            await _hitLogRepository.AddAsync(newHitLog);
        }
    }

    public async Task<int> GetHitsAsync(string entityName, int entityId)
    {
        return await _hitLogRepository.GetTotalHitsAsync(entityName, entityId);
    }
}
