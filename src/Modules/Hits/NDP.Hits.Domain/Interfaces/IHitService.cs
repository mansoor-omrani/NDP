using System.Threading.Tasks;

namespace NDP.Hits.Domain.Interfaces;

public interface IHitService
{
    Task SaveHitAsync(int? userId, string entityName, int entityId);
    Task<int> GetHitsAsync(string entityName, int entityId);
}
