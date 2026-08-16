using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NDP.Books.Application.Commands.AddBook;
using NDP.Books.Application.Commands.DeleteBook;
using NDP.Books.Application.Commands.EditBook;
using NDP.Books.Application.Commands.RemoveBook;
using NDP.Books.Application.Commands.RestoreBook;
using NDP.Books.Application.Queries.ExportBooksExcel;
using NDP.Books.Application.Queries.GetBookById;
using NDP.Books.Application.Queries.GetBooksRange;

namespace NDP.Books.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("default")]
public class BooksController : ControllerBase
{
    private readonly IMediator _mediator;

    public BooksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetBookByIdQuery { BookId = id });
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetRange([FromQuery] GetBooksRangeQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("export")]
    [Authorize(Roles = "Administrator,Manager")]
    public async Task<IActionResult> ExportExcel([FromQuery] ExportBooksExcelQuery query)
    {
        var result = await _mediator.Send(query);
        return File(result, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "books.xlsx");
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,Manager,Operator")]
    public async Task<IActionResult> Add([FromBody] AddBookCommand command)
    {
        var userId = GetUserId();
        var updatedCommand = command with { CreatedBy = userId };
        var result = await _mediator.Send(updatedCommand);
        return CreatedAtAction(nameof(GetById), new { id = result }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Administrator,Manager,Operator")]
    public async Task<IActionResult> Edit(int id, [FromBody] EditBookCommand command)
    {
        var userId = GetUserId();
        var updatedCommand = command with { BookId = id, ModifiedBy = userId };
        var result = await _mediator.Send(updatedCommand);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrator,Manager")]
    public async Task<IActionResult> Remove(int id)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new RemoveBookCommand { BookId = id, UserId = userId });
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id:int}/restore")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Restore(int id)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new RestoreBookCommand { BookId = id, UserId = userId });
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}/permanent")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeletePermanently(int id)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new DeleteBookCommand { BookId = id, UserId = userId });
        if (!result) return NotFound();
        return NoContent();
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }
}
