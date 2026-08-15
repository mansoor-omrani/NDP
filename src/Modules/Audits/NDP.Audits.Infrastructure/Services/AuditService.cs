using System;
using System.Threading.Tasks;
using NDP.Audits.Domain.Entities;
using NDP.Audits.Domain.Interfaces;

namespace NDP.Audits.Infrastructure.Services;

public class AuditService : IAuditService
{
    private readonly IAuditLogRepository _auditLogRepository;

    public AuditService(IAuditLogRepository auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    public async Task LogAsync(
        int? userId,
        string userName,
        int entityId,
        string entityName,
        string action,
        string changes,
        string ip)
    {
        var auditLog = new AuditLog
        {
            AuditDate = DateTime.UtcNow,
            IP = ip,
            UserId = userId,
            UserName = userName,
            EntityId = entityId,
            EntityName = entityName,
            Action = action,
            Changes = changes
        };

        await _auditLogRepository.AddAsync(auditLog);
    }
}
