using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using NDP.Audits.Domain.Entities;

namespace NDP.Audits.Domain.Interfaces;

public interface IAuditLogRepository
{
    Task<AuditLog?> GetByIdAsync(int id);
    Task<IEnumerable<AuditLog>> GetRangeAsync(
        int skip,
        int take,
        Expression<Func<AuditLog, bool>>? filter = null,
        Func<IQueryable<AuditLog>, IOrderedQueryable<AuditLog>>? orderBy = null);
    Task<int> CountAsync(Expression<Func<AuditLog, bool>>? filter = null);
    Task<AuditLog> AddAsync(AuditLog auditLog);
}
