using MediatR;

namespace NDP.Books.Application.Queries.ExportBooksExcel;

public record ExportBooksExcelQuery : IRequest<byte[]>
{
    public string? SearchTerm { get; init; }
    public string? Author { get; init; }
    public string? Publisher { get; init; }
    public string? PublishedYear { get; init; }
}
