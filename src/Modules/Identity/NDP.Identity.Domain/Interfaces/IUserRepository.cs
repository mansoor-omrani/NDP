using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NDP.Identity.Domain.Entities;

namespace NDP.Identity.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByPhoneNumberAsync(string phoneNumber);
    Task<User> AddAsync(User user);
    Task UpdateAsync(User user);
    Task UpdatePasswordAsync(int userId, string passwordHash);
    Task UpdateLastLoginAsync(int userId, DateTime? lastLogin);
    Task<int> GetAccessFailedCountAsync(int userId);
    Task IncrementAccessFailedCountAsync(int userId);
    Task ResetAccessFailedCountAsync(int userId);
    Task<IEnumerable<Role>> GetUserRolesAsync(int userId);
    Task AssignRolesAsync(int userId, IEnumerable<int> roleIds);
    Task RemoveAllRolesAsync(int userId);
    Task<bool> ExistsAsync(int id);
}
