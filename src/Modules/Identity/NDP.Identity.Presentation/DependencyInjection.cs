using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NDP.Identity.Application;
using NDP.Identity.Infrastructure;
using NDP.Identity.Presentation.Configuration;

namespace NDP.Identity.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddIdentityModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<IdentitySettings>(configuration.GetSection(IdentitySettings.SectionName));
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.AddIdentityApplication();
        services.AddIdentityInfrastructure(configuration);
        return services;
    }
}
