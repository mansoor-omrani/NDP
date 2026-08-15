import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBooks(page: number = 1, pageSize: number = 12, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    
    return this.http.get(`${this.apiUrl}/books`, { params });
  }

  getBookById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`);
  }

  addBook(book: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, book);
  }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/books/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`);
  }

  restoreBook(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/books/${id}/restore`, {});
  }
}
