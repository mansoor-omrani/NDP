using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace NDP.Audits.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddAuditsApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        return services;
    }
}
