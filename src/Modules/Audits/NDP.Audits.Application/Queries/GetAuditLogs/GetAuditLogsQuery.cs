using System;
using MediatR;
using NDP.Audits.Application.DTOs;

namespace NDP.Audits.Application.Queries.GetAuditLogs;

public record GetAuditLogsQuery : IRequest<PagedResult<AuditLogDto>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
    public string? UserName { get; init; }
    public string? EntityName { get; init; }
    public int? EntityId { get; init; }
    public string? IP { get; init; }
    public string? SortColumn { get; init; }
    public string? SortDirection { get; init; }
}
