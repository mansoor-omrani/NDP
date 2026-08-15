using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NDP.Hits.Application.Commands.SaveHit;
using NDP.Hits.Application.Queries.GetHits;

namespace NDP.Hits.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("default")]
public class HitsController : ControllerBase
{
    private readonly IMediator _mediator;

    public HitsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> SaveHit([FromBody] SaveHitCommand command)
    {
        int? userId = null;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var parsedUserId))
        {
            userId = parsedUserId;
        }

        var updatedCommand = command with { UserId = userId };
        var result = await _mediator.Send(updatedCommand);
        return Ok(result);
    }

    [HttpGet("{entityName}/{entityId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetHits(string entityName, int entityId)
    {
        var result = await _mediator.Send(new GetHitsQuery { EntityName = entityName, EntityId = entityId });
        return Ok(result);
    }
}
