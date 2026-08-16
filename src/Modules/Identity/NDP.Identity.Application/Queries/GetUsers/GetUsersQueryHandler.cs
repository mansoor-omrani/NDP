using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NDP.Identity.Application.DTOs;
using NDP.Identity.Application.Queries.GetUsers;
using NDP.Identity.Infrastructure.Persistence;

namespace NDP.Identity.Application.Queries.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PagedResult<UserDto>>
{
    private readonly IdentityDbContext _context;

    public GetUsersQueryHandler(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(u => 
                u.UserName.Contains(request.SearchTerm) ||
                u.Email.Contains(request.SearchTerm) ||
                u.FirstName.Contains(request.SearchTerm) ||
                u.LastName.Contains(request.SearchTerm));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var users = await query
            .OrderBy(u => u.Id)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                .ToListAsync(cancellationToken);

            var userDto = user.Adapt<UserDto>();
            userDto.Roles = roles;
            userDtos.Add(userDto);
        }

        return new PagedResult<UserDto>
        {
            Items = userDtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
