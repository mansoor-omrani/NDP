using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDP.Identity.Application.Commands.SaveProfile;
using NDP.Identity.Application.Queries.GetProfile;

namespace NDP.Identity.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetProfileQuery { UserId = userId });
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> SaveProfile([FromBody] SaveProfileCommand command)
    {
        var userId = GetUserId();
        var updatedCommand = command with { UserId = userId };
        var result = await _mediator.Send(updatedCommand);
        if (!result) return NotFound();
        return NoContent();
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }
}
