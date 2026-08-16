using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Mapster;
using MediatR;
using NDP.Books.Application.DTOs;
using NDP.Books.Application.Queries.GetBooksRange;
using NDP.Books.Domain.Entities;
using NDP.Books.Domain.Interfaces;

namespace NDP.Books.Application.Queries.GetBooksRange;

public class GetBooksRangeQueryHandler : IRequestHandler<GetBooksRangeQuery, PagedResult<BookDto>>
{
    private readonly IBookRepository _bookRepository;

    public GetBooksRangeQueryHandler(IBookRepository bookRepository)
    {
        _bookRepository = bookRepository;
    }

    public async Task<PagedResult<BookDto>> Handle(GetBooksRangeQuery request, CancellationToken cancellationToken)
    {
        Expression<Func<Book, bool>>? filter = null;

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.Trim().ToLower();
            filter = b => 
                b.Title.ToLower().Contains(searchTerm) || 
                b.Author.ToLower().Contains(searchTerm) || 
                b.Publisher.ToLower().Contains(searchTerm) ||
                b.Genre.ToLower().Contains(searchTerm);
        }

        if (!string.IsNullOrWhiteSpace(request.Author))
        {
            var authorFilter = filter;
            filter = b => (authorFilter == null || authorFilter.Compile()(b)) && b.Author == request.Author;
        }

        if (!string.IsNullOrWhiteSpace(request.Publisher))
        {
            var publisherFilter = filter;
            filter = b => (publisherFilter == null || publisherFilter.Compile()(b)) && b.Publisher == request.Publisher;
        }

        if (!string.IsNullOrWhiteSpace(request.PublishedYear))
        {
            var yearFilter = filter;
            filter = b => (yearFilter == null || yearFilter.Compile()(b)) && b.PublishedYear == request.PublishedYear;
        }

        Func<IQueryable<Book>, IOrderedQueryable<Book>>? orderBy = null;

        if (!string.IsNullOrWhiteSpace(request.SortColumn))
        {
            var isAscending = string.IsNullOrEmpty(request.SortDirection) || 
                             request.SortDirection.ToLower() == "asc";

            orderBy = request.SortColumn.ToLower() switch
            {
                "title" => q => isAscending ? q.OrderBy(b => b.Title) : q.OrderByDescending(b => b.Title),
                "author" => q => isAscending ? q.OrderBy(b => b.Author) : q.OrderByDescending(b => b.Author),
                "publisher" => q => isAscending ? q.OrderBy(b => b.Publisher) : q.OrderByDescending(b => b.Publisher),
                "publishedyear" => q => isAscending ? q.OrderBy(b => b.PublishedYear) : q.OrderByDescending(b => b.PublishedYear),
                "genre" => q => isAscending ? q.OrderBy(b => b.Genre) : q.OrderByDescending(b => b.Genre),
                "createddate" => q => isAscending ? q.OrderBy(b => b.CreatedDate) : q.OrderByDescending(b => b.CreatedDate),
                _ => q => q.OrderByDescending(b => b.CreatedDate)
            };
        }
        else
        {
            orderBy = q => q.OrderByDescending(b => b.CreatedDate);
        }

        var skip = (request.Page - 1) * request.PageSize;
        var books = await _bookRepository.GetRangeAsync(skip, request.PageSize, filter, orderBy, request.IncludeDeleted);
        var totalCount = await _bookRepository.CountAsync(filter, request.IncludeDeleted);

        var bookDtos = books.Adapt<List<BookDto>>();

        return new PagedResult<BookDto>
        {
            Items = bookDtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
