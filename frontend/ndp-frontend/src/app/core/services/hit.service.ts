import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HitService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  saveHit(entityName: string, entityId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/hits`, { entityName, entityId });
  }

  getHits(entityName: string, entityId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/hits/${entityName}/${entityId}`);
  }
}
