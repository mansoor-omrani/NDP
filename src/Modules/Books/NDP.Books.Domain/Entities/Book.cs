using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDP.Books.Domain.Entities;

public class Book
{
    [Key]
    public int BookId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Author { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string Publisher { get; set; } = string.Empty;
    
    [MaxLength(4)]
    public string PublishedYear { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Genre { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Photo { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;
    
    public bool IsDeleted { get; set; }
    
    public int CreatedBy { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    public int? LastModifiedBy { get; set; }
    
    public DateTime? LastModifiedDate { get; set; }
}
