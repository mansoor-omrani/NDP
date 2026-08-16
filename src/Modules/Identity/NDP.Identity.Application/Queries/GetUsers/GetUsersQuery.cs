using MediatR;
using NDP.Identity.Application.DTOs;

namespace NDP.Identity.Application.Queries.GetUsers;

public record GetUsersQuery : IRequest<PagedResult<UserDto>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string? SearchTerm { get; init; }
}
