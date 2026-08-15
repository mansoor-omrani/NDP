using System;

namespace NDP.Audits.Application.DTOs;

public class AuditLogDto
{
    public int Id { get; set; }
    public DateTime AuditDate { get; set; }
    public string IP { get; set; } = string.Empty;
    public int? UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Changes { get; set; } = string.Empty;
}
