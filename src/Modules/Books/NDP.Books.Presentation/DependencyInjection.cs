using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NDP.Books.Application;
using NDP.Books.Infrastructure;
using NDP.Books.Presentation.Configuration;

namespace NDP.Books.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddBooksModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<BooksSettings>(configuration.GetSection(BooksSettings.SectionName));
        services.AddBooksApplication();
        services.AddBooksInfrastructure(configuration);
        return services;
    }
}
