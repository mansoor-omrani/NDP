using System.Threading;
using System.Threading.Tasks;
using MediatR;
using NDP.Books.Application.DTOs;
using NDP.Books.Application.Queries.GetBookById;
using NDP.Books.Domain.Interfaces;

namespace NDP.Books.Application.Queries.GetBookById;

public class GetBookByIdQueryHandler : IRequestHandler<GetBookByIdQuery, BookDto?>
{
    private readonly IBookRepository _bookRepository;

    public GetBookByIdQueryHandler(IBookRepository bookRepository)
    {
        _bookRepository = bookRepository;
    }

    public async Task<BookDto?> Handle(GetBookByIdQuery request, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.GetByIdAsync(request.BookId);
        if (book == null) return null;

        return new BookDto
        {
            BookId = book.BookId,
            Title = book.Title,
            Author = book.Author,
            Publisher = book.Publisher,
            PublishedYear = book.PublishedYear,
            Genre = book.Genre,
            Photo = book.Photo,
            Description = book.Description,
            Url = book.Url,
            IsDeleted = book.IsDeleted,
            CreatedBy = book.CreatedBy,
            CreatedDate = book.CreatedDate,
            LastModifiedBy = book.LastModifiedBy,
            LastModifiedDate = book.LastModifiedDate
        };
    }
}
