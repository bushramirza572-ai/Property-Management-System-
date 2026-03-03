import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email    = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.error   = '';

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.authService.saveSession(res.token, res.user);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error   = err.error?.message || 'Login failed';
          this.loading = false;
        }
      });
  }
}

