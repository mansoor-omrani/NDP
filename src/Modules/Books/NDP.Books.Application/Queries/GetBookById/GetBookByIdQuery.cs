using MediatR;
using NDP.Books.Application.DTOs;

namespace NDP.Books.Application.Queries.GetBookById;

public record GetBookByIdQuery : IRequest<BookDto?>
{
    public int BookId { get; init; }
}
