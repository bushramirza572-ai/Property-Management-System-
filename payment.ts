import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Payment {
  private apiUrl = environment.apiUrl + '/payments';
  
  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      })
    };
  }

  getAll()                    { return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()); }
  getMyPayments()             { return this.http.get<any[]>(`${this.apiUrl}/me`, this.getAuthHeaders()); }
  getStats()                  { return this.http.get<any>(`${this.apiUrl}/stats`, this.getAuthHeaders()); }
  getById(id: number)         { return this.http.get<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders()); }
  create(data: any)           { return this.http.post(this.apiUrl, data, this.getAuthHeaders()); }
  update(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders()); }
  delete(id: number)          { return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders()); }
  markPaid(id: number) {
  return this.http.patch(`${this.apiUrl}/${id}`, {
    status: 'paid',
    payment_date: new Date().toISOString().substring(0,10)
  });
}
}