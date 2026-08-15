using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDP.Identity.Domain.Entities;

public class UserRole
{
    [Key]
    [Column(Order = 1)]
    public int UserId { get; set; }
    
    [Key]
    [Column(Order = 2)]
    public int RoleId { get; set; }
    
    [ForeignKey("UserId")]
    public User? User { get; set; }
    
    [ForeignKey("RoleId")]
    public Role? Role { get; set; }
}
