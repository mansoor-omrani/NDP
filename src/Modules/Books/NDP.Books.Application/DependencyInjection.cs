using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace NDP.Books.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddBooksApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        return services;
    }
}
