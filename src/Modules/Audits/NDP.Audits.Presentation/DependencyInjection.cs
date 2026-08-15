using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NDP.Audits.Application;
using NDP.Audits.Infrastructure;
using NDP.Audits.Presentation.Configuration;

namespace NDP.Audits.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddAuditsModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<AuditsSettings>(configuration.GetSection(AuditsSettings.SectionName));
        services.AddAuditsApplication();
        services.AddAuditsInfrastructure(configuration);
        return services;
    }
}
