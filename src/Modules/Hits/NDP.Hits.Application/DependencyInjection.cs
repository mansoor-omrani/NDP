using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace NDP.Hits.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddHitsApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        return services;
    }
}
