using System.Collections.Generic;
using System.Security.Claims;
using NDP.Identity.Domain.Entities;

namespace NDP.Identity.Domain.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user, IEnumerable<Role> roles);
    ClaimsPrincipal? ValidateToken(string token);
}
