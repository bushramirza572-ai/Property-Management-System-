import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name     = '';
  email    = '';
  password = '';
  role     = 'tenant';
  error    = '';
  loading  = false;

  constructor(private authService: AuthService, private router: Router) {}
  onRegister() {
    this.loading = true;
    this.error   = '';
    this.authService.register({
      name: this.name, email: this.email,
      password: this.password, role: this.role
    }).subscribe({
      next: () => {
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error   = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }

}
