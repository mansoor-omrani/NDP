using MediatR;
using NDP.Identity.Application.DTOs;

namespace NDP.Identity.Application.Queries.GetProfile;

public record GetProfileQuery : IRequest<UserProfileDto?>
{
    public int UserId { get; init; }
}
