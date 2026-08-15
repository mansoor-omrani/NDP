using System.Collections.Generic;
using System.Threading.Tasks;
using NDP.Identity.Domain.Entities;

namespace NDP.Identity.Domain.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByIdAsync(int id);
    Task<Role?> GetByNameAsync(string name);
    Task<IEnumerable<Role>> GetAllAsync();
    Task<Role> AddAsync(Role role);
    Task UpdateAsync(Role role);
    Task DeleteAsync(int id);
}
