using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDP.Identity.Application.Commands.AssignRole;
using NDP.Identity.Application.Commands.DeleteUser;
using NDP.Identity.Application.Commands.SaveProfile;
using NDP.Identity.Application.Queries.GetProfile;
using NDP.Identity.Application.Queries.GetUsers;

namespace NDP.Identity.Presentation.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Administrator")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? searchTerm = null)
    {
        var query = new GetUsersQuery
        {
            Page = page,
            PageSize = pageSize,
            SearchTerm = searchTerm
        };
        
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var result = await _mediator.Send(new GetProfileQuery { UserId = id });
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] SaveProfileCommand command)
    {
        var updatedCommand = command with { UserId = id };
        var result = await _mediator.Send(updatedCommand);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var adminUserId = GetUserId();
        var result = await _mediator.Send(new DeleteUserCommand 
        { 
            UserId = id, 
            DeletedBy = adminUserId 
        });
        
        if (!result) return BadRequest(new { message = "Cannot delete this user." });
        return NoContent();
    }

    [HttpPost("{id:int}/roles")]
    public async Task<IActionResult> AssignRoles(int id, [FromBody] AssignRoleCommand command)
    {
        var adminUserId = GetUserId();
        var updatedCommand = command with { UserId = id, AssignedBy = adminUserId };
        var result = await _mediator.Send(updatedCommand);
        if (!result) return NotFound();
        return Ok();
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }
}
