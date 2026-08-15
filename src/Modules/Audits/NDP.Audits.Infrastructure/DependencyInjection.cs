using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NDP.Audits.Domain.Interfaces;
using NDP.Audits.Infrastructure.Persistence;
using NDP.Audits.Infrastructure.Persistence.Repositories;
using NDP.Audits.Infrastructure.Services;

namespace NDP.Audits.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddAuditsInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        services.AddDbContext<AuditsDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<IAuditLogRepository, AuditLogRepository>();
        services.AddScoped<IAuditService, AuditService>();

        return services;
    }
}
