using Microsoft.EntityFrameworkCore;
using NDP.Identity.Domain.Entities;
using NDP.Identity.Infrastructure.Persistence;

namespace NDP.Api.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var identityDbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();

        await identityDbContext.Database.EnsureCreatedAsync();

        // Seed Roles
        if (!await identityDbContext.Roles.AnyAsync())
        {
            var roles = new List<Role>
            {
                new Role { Name = "Administrator", NormalizedName = "ADMINISTRATOR" },
                new Role { Name = "Manager", NormalizedName = "MANAGER" },
                new Role { Name = "Operator", NormalizedName = "OPERATOR" },
                new Role { Name = "Member", NormalizedName = "MEMBER" }
            };

            await identityDbContext.Roles.AddRangeAsync(roles);
            await identityDbContext.SaveChangesAsync();
        }

        // Seed Administrator User
        if (!await identityDbContext.Users.AnyAsync(u => u.UserName == "admin"))
        {
            var adminUser = new User
            {
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                Email = "admin@ndp-library.com",
                NormalizedEmail = "ADMIN@NDP-LIBRARY.COM",
                EmailConfirmed = true,
                PhoneNumber = "09120000000",
                NormalizedPhoneNumber = "09120000000",
                PhoneNumberConfirmed = true,
                FirstName = "System",
                LastName = "Administrator",
                Avatar = "",
                LockedOutEnabled = true,
                AccessFailedCount = 0
            };

            await identityDbContext.Users.AddAsync(adminUser);
            await identityDbContext.SaveChangesAsync();

            // Assign Administrator role to admin user
            var adminRole = await identityDbContext.Roles.FirstOrDefaultAsync(r => r.Name == "Administrator");
            if (adminRole != null)
            {
                await identityDbContext.UserRoles.AddAsync(new UserRole
                {
                    UserId = adminUser.Id,
                    RoleId = adminRole.Id
                });
                await identityDbContext.SaveChangesAsync();
            }
        }
    }
}
