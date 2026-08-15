import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../../core/services/audit.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-6">Audit Logs</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-left">User</th>
              <th class="px-4 py-2 text-left">Action</th>
              <th class="px-4 py-2 text-left">Entity</th>
              <th class="px-4 py-2 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            @for (log of auditLogs; track log.id) {
              <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-2">{{ log.auditDate | date:'medium' }}</td>
                <td class="px-4 py-2">{{ log.userName }}</td>
                <td class="px-4 py-2">{{ log.action }}</td>
                <td class="px-4 py-2">{{ log.entityName }} #{{ log.entityId }}</td>
                <td class="px-4 py-2">{{ log.ip }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      
      @if (auditLogs.length === 0) {
        <p class="text-center text-gray-500 py-8">No audit logs found.</p>
      }
    </div>
  `
})
export class AuditLogComponent implements OnInit {
  auditLogs: any[] = [];

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.auditService.getAuditLogs(1, 20).subscribe({
      next: (response) => {
        this.auditLogs = response.items;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
      }
    });
  }
}
