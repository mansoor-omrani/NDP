using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Api.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITokenBlacklistService tokenBlacklistService)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null && await tokenBlacklistService.IsTokenBlacklistedAsync(token))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Token is blacklisted");
            return;
        }

        await _next(context);
    }
}
