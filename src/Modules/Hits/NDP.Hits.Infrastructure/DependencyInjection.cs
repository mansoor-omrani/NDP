using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NDP.Hits.Domain.Interfaces;
using NDP.Hits.Infrastructure.Persistence;
using NDP.Hits.Infrastructure.Persistence.Repositories;
using NDP.Hits.Infrastructure.Services;

namespace NDP.Hits.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddHitsInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        services.AddDbContext<HitsDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<IHitLogRepository, HitLogRepository>();
        services.AddScoped<IHitService, HitService>();

        return services;
    }
}
