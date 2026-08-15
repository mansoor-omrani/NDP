using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDP.Audits.Domain.Entities;

public class AuditLog
{
    [Key]
    public int Id { get; set; }
    
    public DateTime AuditDate { get; set; }
    
    [MaxLength(50)]
    public string IP { get; set; } = string.Empty;
    
    public int? UserId { get; set; }
    
    [MaxLength(50)]
    public string UserName { get; set; } = string.Empty;
    
    public int EntityId { get; set; }
    
    [MaxLength(50)]
    public string EntityName { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Action { get; set; } = string.Empty;
    
    public string Changes { get; set; } = string.Empty;
}
