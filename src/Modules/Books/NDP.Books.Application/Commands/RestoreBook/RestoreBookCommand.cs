using MediatR;

namespace NDP.Books.Application.Commands.RestoreBook;

public record RestoreBookCommand : IRequest<bool>
{
    public int BookId { get; init; }
    public int UserId { get; init; }
}
