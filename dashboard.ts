import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { Payment } from '../../../core/services/payment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
  user: any;
  stats: any = {};
  loading = true;
  isAdmin = false;

  constructor(
    private paymentService: Payment,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.isAdmin = this.user?.role === 'admin';

    if (this.isAdmin) {
      // Admin sees full stats
      this.paymentService.getStats().subscribe({
        next: (data) => { 
          this.stats = data; 
          this.loading = false; 
          this.cdr.detectChanges();
        },
        error: () => { this.loading = false; 
          this.cdr.detectChanges();
        }
      });
    } else {
      // Tenant sees only their own payments
      this.paymentService.getMyPayments().subscribe({
        next: (payments) => {
          this.calculateUserStats(payments);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => { 
          this.loading = false;
        this.cdr.detectChanges(); }

      });
    }
  }

  calculateUserStats(payments: any[]) {
    const totalPaid = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const overdueCount = payments
      .filter(p => p.status === 'overdue').length;

    this.stats = {
      myRent: payments[0]?.amount || 0,
      totalPaid,
      totalPending,
      overdueCount
    };
  }
}
