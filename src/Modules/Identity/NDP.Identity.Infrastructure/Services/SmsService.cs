using System.Threading.Tasks;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Infrastructure.Services;

public class SmsService : ISmsService
{
    public async Task SendSmsAsync(string to, string message)
    {
        // TODO: پیاده‌سازی ارسال پیامک
        await Task.CompletedTask;
    }
}
