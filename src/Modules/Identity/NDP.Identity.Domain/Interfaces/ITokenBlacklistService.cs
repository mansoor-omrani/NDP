using System.Threading.Tasks;

namespace NDP.Identity.Domain.Interfaces;

public interface ITokenBlacklistService
{
    Task BlacklistTokenAsync(string token, int userId);
    Task<bool> IsTokenBlacklistedAsync(string token);
}
