import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  user: any = {};
  form = { name: '', email: '' };
  message = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private http: HttpClient, private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser() || {};
    this.form = { name: this.user.name, email: this.user.email };
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      })
    };
  }

  onUpdate(): void {
    this.loading = true;
    this.message = '';
    this.error = '';

    if (!this.form.name || !this.form.email) {
      this.error = 'Name and email are required';
      this.loading = false;
      return;
    }

    this.http.put(
      `${environment.apiUrl}/users/${this.user.id}`,
      this.form,
      this.getAuthHeaders()
    ).subscribe({
      next: () => {
  const updated = { ...this.user, ...this.form };

  this.authService.setCurrentUser(updated);
  this.user = updated;

  this.message = 'Profile updated successfully!';
  this.loading = false;

  this.cd.detectChanges();   // 🔥 FORCE UI UPDATE

  setTimeout(() => this.message = '', 3000);
},
      error: (err) => {
        this.error = err.error?.message || 'Update failed';
        this.loading = false;
      }
    });
  }

}