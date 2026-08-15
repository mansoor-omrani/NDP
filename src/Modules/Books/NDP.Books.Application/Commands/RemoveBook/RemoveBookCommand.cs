using MediatR;

namespace NDP.Books.Application.Commands.RemoveBook;

public record RemoveBookCommand : IRequest<bool>
{
    public int BookId { get; init; }
    public int UserId { get; init; }
}
