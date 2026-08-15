using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NDP.Hits.Application;
using NDP.Hits.Infrastructure;
using NDP.Hits.Presentation.Configuration;

namespace NDP.Hits.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddHitsModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<HitsSettings>(configuration.GetSection(HitsSettings.SectionName));
        services.AddHitsApplication();
        services.AddHitsInfrastructure(configuration);
        return services;
    }
}
