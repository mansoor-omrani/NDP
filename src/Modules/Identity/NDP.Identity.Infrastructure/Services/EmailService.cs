using System.Threading.Tasks;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Infrastructure.Services;

public class EmailService : IEmailService
{
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        // TODO: پیاده‌سازی ارسال ایمیل
        await Task.CompletedTask;
    }
}
