using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Books.Domain.Entities;
using NDP.Books.Domain.Interfaces;
using NDP.Books.Infrastructure.Persistence;

namespace NDP.Books.Infrastructure.Persistence.Repositories;

public class BookRepository : IBookRepository
{
    private readonly BooksDbContext _context;

    public BookRepository(BooksDbContext context)
    {
        _context = context;
    }

    public async Task<Book?> GetByIdAsync(int id, bool includeDeleted = false)
    {
        var query = _context.Books.AsQueryable();
        if (!includeDeleted)
        {
            query = query.Where(b => !b.IsDeleted);
        }
        return await query.FirstOrDefaultAsync(b => b.BookId == id);
    }

    public async Task<IEnumerable<Book>> GetRangeAsync(
        int skip,
        int take,
        Expression<Func<Book, bool>>? filter = null,
        Func<IQueryable<Book>, IOrderedQueryable<Book>>? orderBy = null,
        bool includeDeleted = false)
    {
        var query = _context.Books.AsQueryable();

        if (!includeDeleted)
        {
            query = query.Where(b => !b.IsDeleted);
        }

        if (filter != null)
        {
            query = query.Where(filter);
        }

        if (orderBy != null)
        {
            return await orderBy(query).Skip(skip).Take(take).ToListAsync();
        }

        return await query.Skip(skip).Take(take).ToListAsync();
    }

    public async Task<int> CountAsync(Expression<Func<Book, bool>>? filter = null, bool includeDeleted = false)
    {
        var query = _context.Books.AsQueryable();

        if (!includeDeleted)
        {
            query = query.Where(b => !b.IsDeleted);
        }

        if (filter != null)
        {
            query = query.Where(filter);
        }

        return await query.CountAsync();
    }

    public async Task<Book> AddAsync(Book book)
    {
        await _context.Books.AddAsync(book);
        await _context.SaveChangesAsync();
        return book;
    }

    public async Task UpdateAsync(Book book)
    {
        _context.Books.Update(book);
        await _context.SaveChangesAsync();
    }

    public async Task SoftDeleteAsync(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book != null)
        {
            book.IsDeleted = true;
            book.LastModifiedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RestoreAsync(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book != null)
        {
            book.IsDeleted = false;
            book.LastModifiedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task HardDeleteAsync(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book != null)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id, bool includeDeleted = false)
    {
        var query = _context.Books.AsQueryable();
        if (!includeDeleted)
        {
            query = query.Where(b => !b.IsDeleted);
        }
        return await query.AnyAsync(b => b.BookId == id);
    }
}
