using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDP.Identity.Domain.Entities;

public class User
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string UserName { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string NormalizedUserName { get; set; } = string.Empty;
    
    public string PasswordHash { get; set; } = string.Empty;
    
    public string SecurityStamp { get; set; } = string.Empty;
    
    public string ConcurrencyStamp { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string NormalizedEmail { get; set; } = string.Empty;
    
    public bool EmailConfirmed { get; set; }
    
    [MaxLength(10)]
    public string? EmailConfirmationCode { get; set; }
    
    public DateTimeOffset? EmailConfirmationExpiryTime { get; set; }
    
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string NormalizedPhoneNumber { get; set; } = string.Empty;
    
    public bool PhoneNumberConfirmed { get; set; }
    
    [MaxLength(10)]
    public string? PhoneNumberConfirmationCode { get; set; }
    
    public DateTimeOffset? PhoneNumberConfirmationExpiryTime { get; set; }
    
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Avatar { get; set; } = string.Empty;
    
    public DateTime? LastLogin { get; set; }
    
    public bool LockedOutEnabled { get; set; }
    
    public DateTime? LockedOutEnd { get; set; }
    
    public int AccessFailedCount { get; set; }
}
