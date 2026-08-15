using System.Threading.Tasks;

namespace NDP.Identity.Domain.Interfaces;

public interface ISmsService
{
    Task SendSmsAsync(string to, string message);
}
