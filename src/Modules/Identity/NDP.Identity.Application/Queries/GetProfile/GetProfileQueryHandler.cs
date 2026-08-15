using System.Threading;
using System.Threading.Tasks;
using MediatR;
using NDP.Identity.Application.DTOs;
using NDP.Identity.Application.Queries.GetProfile;
using NDP.Identity.Domain.Interfaces;

namespace NDP.Identity.Application.Queries.GetProfile;

public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, UserProfileDto?>
{
    private readonly IUserRepository _userRepository;

    public GetProfileQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserProfileDto?> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return null;

        return new UserProfileDto
        {
            UserId = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Avatar = user.Avatar,
            LastLogin = user.LastLogin
        };
    }
}
