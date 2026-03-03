import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Tenant {
  private apiUrl = 'http://localhost:3000/api/tenants';
  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): { headers: HttpHeaders} {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}`:'',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      })
    };
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  getMyTenants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`, this.getAuthHeaders());
  }
  
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, this.getAuthHeaders());
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
