import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { Payment } from '../../../core/services/payment';
import { Tenant } from '../../../core/services/tenant';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.scss',
})
export class PaymentList implements OnInit{
  payments: any[] = [];
  tenants: any[] = [];
  loading = true;
  showForm = false;
  selectedPayment: any = null;
  isAdmin = false;

  payForm = {
    tenant_id: '', property_id: '', amount: 0,
    payment_date: '', due_date: '', status: 'pending', notes: ''
  };
  formError = '';
  formLoading = false;

  constructor(
    private paymentService: Payment,
    private tenantService: Tenant,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.getCurrentUser()?.role === 'admin';
    console.log('isAdmin:', this.isAdmin);
    this.load();
    this.tenantService.getAll().subscribe({
      next: d => this.tenants = d
    });
  }

  load() {
    this.loading = true;
    const req = this.isAdmin
      ? this.paymentService.getAll()
      : this.paymentService.getMyPayments();
    req.subscribe({
      next: d => { this.payments = d; this.loading = false; this.cdr.detectChanges();},
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  openCreate() {
    this.selectedPayment = null;
    this.payForm = { tenant_id: '', property_id: '', amount: 0, payment_date: '', due_date: '', status: 'pending', notes: '' };
    this.formError = '';
    this.showForm = true;
  }

  openEdit(p: any) {
    this.selectedPayment = { ...p };
    this.payForm = {
      tenant_id: p.tenant_id, property_id: p.property_id,
      amount: p.amount, payment_date: p.payment_date?.substring(0,10) || '',
      due_date: p.due_date?.substring(0,10) || '', status: p.status, notes: p.notes || ''
    };
    this.formError = '';
    this.showForm = true;
  }

  onTenantChange() {
    const t = this.tenants.find(x => x.id == this.payForm.tenant_id);
    if (t) this.payForm.property_id = t.property_id;
  }

  submitForm() {
    this.formLoading = true;
    this.formError = '';
    const req = this.selectedPayment
      ? this.paymentService.update(this.selectedPayment.id, this.payForm)
      : this.paymentService.create(this.payForm);
    req.subscribe({
      next: () => { this.formLoading = false; this.showForm = false; this.load(); this.cdr.detectChanges(); },
      error: (err) => { this.formError = err.error?.message || 'Failed to save'; this.formLoading = false; this.cdr.detectChanges(); }
    });
  }

  cancelForm() { this.showForm = false; }

markPaid(p: any) {
  this.paymentService.markPaid(p.id).subscribe({
    next: () => this.load(),
    error: (err) => console.error('Failed to mark paid', err)
  });
}

  onDelete(id: number) {
    if (!confirm('Delete this payment record?')) return;
    this.paymentService.delete(id).subscribe({ next: () => this.load() });
  }

  statusClass(s: string) {
    return { 'badge-paid': s==='paid', 'badge-pending': s==='pending', 'badge-overdue': s==='overdue' };
  }
}