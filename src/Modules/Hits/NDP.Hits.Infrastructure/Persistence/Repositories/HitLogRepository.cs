using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Hits.Domain.Entities;
using NDP.Hits.Domain.Interfaces;
using NDP.Hits.Infrastructure.Persistence;

namespace NDP.Hits.Infrastructure.Persistence.Repositories;

public class HitLogRepository : IHitLogRepository
{
    private readonly HitsDbContext _context;

    public HitLogRepository(HitsDbContext context)
    {
        _context = context;
    }

    public async Task<HitLog?> GetHitLogAsync(int? userId, string entityName, int entityId)
    {
        return await _context.HitLogs.FirstOrDefaultAsync(h => 
            h.UserId == userId && 
            h.EntityName == entityName && 
            h.EntityId == entityId);
    }

    public async Task<HitLog> AddAsync(HitLog hitLog)
    {
        await _context.HitLogs.AddAsync(hitLog);
        await _context.SaveChangesAsync();
        return hitLog;
    }

    public async Task UpdateAsync(HitLog hitLog)
    {
        _context.HitLogs.Update(hitLog);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetTotalHitsAsync(string entityName, int entityId)
    {
        return await _context.HitLogs
            .Where(h => h.EntityName == entityName && h.EntityId == entityId)
            .SumAsync(h => h.Hits);
    }
}
