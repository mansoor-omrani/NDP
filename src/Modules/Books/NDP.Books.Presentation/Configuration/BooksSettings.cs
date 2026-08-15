namespace NDP.Books.Presentation.Configuration;

public class BooksSettings
{
    public const string SectionName = "Books";
    public bool EnableSoftDelete { get; set; } = true;
    public int DefaultPageSize { get; set; } = 12;
    public int MaxPageSize { get; set; } = 100;
}
