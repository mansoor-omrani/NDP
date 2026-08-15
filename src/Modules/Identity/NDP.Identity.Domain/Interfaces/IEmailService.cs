using System.Threading.Tasks;

namespace NDP.Identity.Domain.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}
