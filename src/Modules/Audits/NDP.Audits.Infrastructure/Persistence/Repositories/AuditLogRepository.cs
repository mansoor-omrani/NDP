using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Audits.Domain.Entities;
using NDP.Audits.Domain.Interfaces;
using NDP.Audits.Infrastructure.Persistence;

namespace NDP.Audits.Infrastructure.Persistence.Repositories;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly AuditsDbContext _context;

    public AuditLogRepository(AuditsDbContext context)
    {
        _context = context;
    }

    public async Task<AuditLog?> GetByIdAsync(int id)
    {
        return await _context.AuditLogs.FindAsync(id);
    }

    public async Task<IEnumerable<AuditLog>> GetRangeAsync(
        int skip,
        int take,
        Expression<Func<AuditLog, bool>>? filter = null,
        Func<IQueryable<AuditLog>, IOrderedQueryable<AuditLog>>? orderBy = null)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (filter != null)
        {
            query = query.Where(filter);
        }

        if (orderBy != null)
        {
            return await orderBy(query).Skip(skip).Take(take).ToListAsync();
        }

        return await query.OrderByDescending(a => a.AuditDate).Skip(skip).Take(take).ToListAsync();
    }

    public async Task<int> CountAsync(Expression<Func<AuditLog, bool>>? filter = null)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (filter != null)
        {
            query = query.Where(filter);
        }

        return await query.CountAsync();
    }

    public async Task<AuditLog> AddAsync(AuditLog auditLog)
    {
        await _context.AuditLogs.AddAsync(auditLog);
        await _context.SaveChangesAsync();
        return auditLog;
    }
}
