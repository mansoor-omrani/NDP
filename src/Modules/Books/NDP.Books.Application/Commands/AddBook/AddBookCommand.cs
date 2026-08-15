using MediatR;

namespace NDP.Books.Application.Commands.AddBook;

public record AddBookCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string Author { get; init; } = string.Empty;
    public string Publisher { get; init; } = string.Empty;
    public string PublishedYear { get; init; } = string.Empty;
    public string Genre { get; init; } = string.Empty;
    public string Photo { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Url { get; init; } = string.Empty;
    public int CreatedBy { get; init; }
}
