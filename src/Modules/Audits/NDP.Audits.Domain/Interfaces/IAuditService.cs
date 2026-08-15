using System.Threading.Tasks;

namespace NDP.Audits.Domain.Interfaces;

public interface IAuditService
{
    Task LogAsync(
        int? userId,
        string userName,
        int entityId,
        string entityName,
        string action,
        string changes,
        string ip);
}
