using MediatR;

namespace NDP.Identity.Application.Commands.SaveProfile;

public record SaveProfileCommand : IRequest<bool>
{
    public int UserId { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Avatar { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
}
