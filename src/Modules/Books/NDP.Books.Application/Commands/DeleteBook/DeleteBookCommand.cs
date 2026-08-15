using MediatR;

namespace NDP.Books.Application.Commands.DeleteBook;

public record DeleteBookCommand : IRequest<bool>
{
    public int BookId { get; init; }
    public int UserId { get; init; }
}
