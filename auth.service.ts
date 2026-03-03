import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  // ✅ Keep user in memory
  private currentUser: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  // ✅ Save session properly
  saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser = user; // store in memory
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ Get user from memory first
  getCurrentUser(): any {
    if (this.currentUser) {
      return this.currentUser;
    }

    const user = localStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;
    return this.currentUser;
  }

  getUserRole(): string | null {
  const user = this.getCurrentUser();
  return user ? user.role : null;
}

isAdmin(): boolean {
  return this.getUserRole() === 'admin';
}

  // ✅ NEW METHOD (IMPORTANT)
  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}