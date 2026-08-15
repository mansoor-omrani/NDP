using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NDP.Books.Domain.Interfaces;
using NDP.Books.Infrastructure.Persistence;
using NDP.Books.Infrastructure.Persistence.Repositories;

namespace NDP.Books.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddBooksInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        services.AddDbContext<BooksDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<IBookRepository, BookRepository>();

        return services;
    }
}
