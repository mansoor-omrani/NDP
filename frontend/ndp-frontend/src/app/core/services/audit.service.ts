import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAuditLogs(page: number = 1, pageSize: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get(`${this.apiUrl}/audits`, { params });
  }
}
