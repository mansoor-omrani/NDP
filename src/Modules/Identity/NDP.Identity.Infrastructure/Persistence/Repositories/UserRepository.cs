using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NDP.Identity.Domain.Entities;
using NDP.Identity.Domain.Interfaces;
using NDP.Identity.Infrastructure.Persistence;

namespace NDP.Identity.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IdentityDbContext _context;

    public UserRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByPhoneNumberAsync(string phoneNumber)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<User> AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePasswordAsync(int userId, string passwordHash)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.PasswordHash = passwordHash;
            user.SecurityStamp = Guid.NewGuid().ToString();
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateLastLoginAsync(int userId, DateTime? lastLogin)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.LastLogin = lastLogin;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetAccessFailedCountAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        return user?.AccessFailedCount ?? 0;
    }

    public async Task IncrementAccessFailedCountAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.AccessFailedCount++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task ResetAccessFailedCountAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.AccessFailedCount = 0;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Role>> GetUserRolesAsync(int userId)
    {
        return await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r)
            .ToListAsync();
    }

    public async Task AssignRolesAsync(int userId, IEnumerable<int> roleIds)
    {
        var existingRoles = await _context.UserRoles.Where(ur => ur.UserId == userId).ToListAsync();
        _context.UserRoles.RemoveRange(existingRoles);

        foreach (var roleId in roleIds)
        {
            await _context.UserRoles.AddAsync(new UserRole { UserId = userId, RoleId = roleId });
        }

        await _context.SaveChangesAsync();
    }

    public async Task RemoveAllRolesAsync(int userId)
    {
        var existingRoles = await _context.UserRoles.Where(ur => ur.UserId == userId).ToListAsync();
        _context.UserRoles.RemoveRange(existingRoles);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int userId)
    {
        // حذف نقش‌های کاربر
        var userRoles = await _context.UserRoles.Where(ur => ur.UserId == userId).ToListAsync();
        _context.UserRoles.RemoveRange(userRoles);

        // حذف کاربر
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }
}
