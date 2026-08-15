using MediatR;
using NDP.Books.Application.DTOs;

namespace NDP.Books.Application.Queries.GetBooksRange;

public record GetBooksRangeQuery : IRequest<PagedResult<BookDto>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 12;
    public string? SearchTerm { get; init; }
    public string? SortColumn { get; init; }
    public string? SortDirection { get; init; }
    public string? Author { get; init; }
    public string? Publisher { get; init; }
    public string? PublishedYear { get; init; }
    public bool IncludeDeleted { get; init; }
}
