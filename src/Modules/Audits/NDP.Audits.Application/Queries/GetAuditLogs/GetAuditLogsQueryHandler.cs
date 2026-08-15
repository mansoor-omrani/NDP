using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using NDP.Audits.Application.DTOs;
using NDP.Audits.Application.Queries.GetAuditLogs;
using NDP.Audits.Domain.Entities;
using NDP.Audits.Domain.Interfaces;

namespace NDP.Audits.Application.Queries.GetAuditLogs;

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, PagedResult<AuditLogDto>>
{
    private readonly IAuditLogRepository _auditLogRepository;

    public GetAuditLogsQueryHandler(IAuditLogRepository auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    public async Task<PagedResult<AuditLogDto>> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
    {
        Expression<Func<AuditLog, bool>>? filter = null;

        if (request.FromDate.HasValue)
        {
            filter = a => a.AuditDate >= request.FromDate.Value;
        }

        if (request.ToDate.HasValue)
        {
            var dateFilter = filter;
            filter = a => (dateFilter == null || dateFilter.Compile()(a)) && a.AuditDate <= request.ToDate.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.UserName))
        {
            var userFilter = filter;
            filter = a => (userFilter == null || userFilter.Compile()(a)) && a.UserName.Contains(request.UserName);
        }

        if (!string.IsNullOrWhiteSpace(request.EntityName))
        {
            var entityFilter = filter;
            filter = a => (entityFilter == null || entityFilter.Compile()(a)) && a.EntityName == request.EntityName;
        }

        if (request.EntityId.HasValue)
        {
            var entityIdFilter = filter;
            filter = a => (entityIdFilter == null || entityIdFilter.Compile()(a)) && a.EntityId == request.EntityId.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.IP))
        {
            var ipFilter = filter;
            filter = a => (ipFilter == null || ipFilter.Compile()(a)) && a.IP == request.IP;
        }

        Func<IQueryable<AuditLog>, IOrderedQueryable<AuditLog>>? orderBy = null;

        if (!string.IsNullOrWhiteSpace(request.SortColumn))
        {
            var isAscending = string.IsNullOrEmpty(request.SortDirection) || 
                             request.SortDirection.ToLower() == "asc";

            orderBy = request.SortColumn.ToLower() switch
            {
                "auditdate" => q => isAscending ? q.OrderBy(a => a.AuditDate) : q.OrderByDescending(a => a.AuditDate),
                "username" => q => isAscending ? q.OrderBy(a => a.UserName) : q.OrderByDescending(a => a.UserName),
                "entityname" => q => isAscending ? q.OrderBy(a => a.EntityName) : q.OrderByDescending(a => a.EntityName),
                "action" => q => isAscending ? q.OrderBy(a => a.Action) : q.OrderByDescending(a => a.Action),
                _ => q => q.OrderByDescending(a => a.AuditDate)
            };
        }
        else
        {
            orderBy = q => q.OrderByDescending(a => a.AuditDate);
        }

        var skip = (request.Page - 1) * request.PageSize;
        var auditLogs = await _auditLogRepository.GetRangeAsync(skip, request.PageSize, filter, orderBy);
        var totalCount = await _auditLogRepository.CountAsync(filter);

        var auditLogDtos = auditLogs.Select(a => new AuditLogDto
        {
            Id = a.Id,
            AuditDate = a.AuditDate,
            IP = a.IP,
            UserId = a.UserId,
            UserName = a.UserName,
            EntityId = a.EntityId,
            EntityName = a.EntityName,
            Action = a.Action,
            Changes = a.Changes
        }).ToList();

        return new PagedResult<AuditLogDto>
        {
            Items = auditLogDtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
