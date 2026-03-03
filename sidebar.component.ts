import { Component }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService }  from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="brand">PMS</div>
      <nav>
        <a routerLink="/dashboard"  routerLinkActive="active">Dashboard</a>
        <a routerLink="/properties" routerLinkActive="active">Properties</a>
        <a routerLink="/tenants"    routerLinkActive="active">Tenants</a>
        <a routerLink="/payments"   routerLinkActive="active">Payments</a>
        <a routerLink="/profile"    routerLinkActive="active">Profile</a>
        <a (click)="logout()" class="logout-btn">Logout</a>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  constructor(private auth: AuthService) {}
  logout() { this.auth.logout(); }
}
