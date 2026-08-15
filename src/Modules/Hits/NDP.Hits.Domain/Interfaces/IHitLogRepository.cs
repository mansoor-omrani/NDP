using System.Threading.Tasks;
using NDP.Hits.Domain.Entities;

namespace NDP.Hits.Domain.Interfaces;

public interface IHitLogRepository
{
    Task<HitLog?> GetHitLogAsync(int? userId, string entityName, int entityId);
    Task<HitLog> AddAsync(HitLog hitLog);
    Task UpdateAsync(HitLog hitLog);
    Task<int> GetTotalHitsAsync(string entityName, int entityId);
}
