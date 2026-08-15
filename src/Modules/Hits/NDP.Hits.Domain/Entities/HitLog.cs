using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDP.Hits.Domain.Entities;

public class HitLog
{
    [Key]
    public int Id { get; set; }
    
    public int? UserId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string EntityName { get; set; } = string.Empty;
    
    public int EntityId { get; set; }
    
    public int Hits { get; set; }
}
