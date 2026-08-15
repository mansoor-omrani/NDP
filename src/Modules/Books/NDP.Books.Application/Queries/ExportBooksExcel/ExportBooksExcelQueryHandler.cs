using System;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using ClosedXML.Excel;
using MediatR;
using NDP.Books.Application.Queries.ExportBooksExcel;
using NDP.Books.Domain.Entities;
using NDP.Books.Domain.Interfaces;

namespace NDP.Books.Application.Queries.ExportBooksExcel;

public class ExportBooksExcelQueryHandler : IRequestHandler<ExportBooksExcelQuery, byte[]>
{
    private readonly IBookRepository _bookRepository;

    public ExportBooksExcelQueryHandler(IBookRepository bookRepository)
    {
        _bookRepository = bookRepository;
    }

    public async Task<byte[]> Handle(ExportBooksExcelQuery request, CancellationToken cancellationToken)
    {
        Expression<Func<Book, bool>>? filter = null;

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            filter = b => b.Title.Contains(request.SearchTerm) || 
                          b.Author.Contains(request.SearchTerm) || 
                          b.Publisher.Contains(request.SearchTerm);
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

        var books = await _bookRepository.GetRangeAsync(0, 10000, filter);

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Books");

        worksheet.Cell(1, 1).Value = "BookId";
        worksheet.Cell(1, 2).Value = "Title";
        worksheet.Cell(1, 3).Value = "Author";
        worksheet.Cell(1, 4).Value = "Publisher";
        worksheet.Cell(1, 5).Value = "PublishedYear";
        worksheet.Cell(1, 6).Value = "Genre";
        worksheet.Cell(1, 7).Value = "CreatedDate";

        var row = 2;
        foreach (var book in books)
        {
            worksheet.Cell(row, 1).Value = book.BookId;
            worksheet.Cell(row, 2).Value = book.Title;
            worksheet.Cell(row, 3).Value = book.Author;
            worksheet.Cell(row, 4).Value = book.Publisher;
            worksheet.Cell(row, 5).Value = book.PublishedYear;
            worksheet.Cell(row, 6).Value = book.Genre;
            worksheet.Cell(row, 7).Value = book.CreatedDate;
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
