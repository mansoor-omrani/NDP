using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using NDP.Books.Domain.Entities;

namespace NDP.Books.Domain.Interfaces;

public interface IBookRepository
{
    Task<Book?> GetByIdAsync(int id, bool includeDeleted = false);
    Task<IEnumerable<Book>> GetRangeAsync(
        int skip,
        int take,
        Expression<Func<Book, bool>>? filter = null,
        Func<IQueryable<Book>, IOrderedQueryable<Book>>? orderBy = null,
        bool includeDeleted = false);
    Task<int> CountAsync(Expression<Func<Book, bool>>? filter = null, bool includeDeleted = false);
    Task<Book> AddAsync(Book book);
    Task UpdateAsync(Book book);
    Task SoftDeleteAsync(int id);
    Task RestoreAsync(int id);
    Task HardDeleteAsync(int id);
    Task<bool> ExistsAsync(int id, bool includeDeleted = false);
}
