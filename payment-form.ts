import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Payment } from '../../../core/services/payment';
import { Tenant } from '../../../core/services/tenant';

@Component({
  selector: 'app-payment-form',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss',
  encapsulation: ViewEncapsulation.None
})
export class PaymentForm {
  @Input() payment: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  tenants: any[] = [];

  form = {
    tenant_id: '', property_id: '', amount: 0,
    payment_date: '', due_date: '', status: 'pending', notes: ''
  };
  error   = '';
  loading = false;

  constructor(
    private paymentService: Payment,
    private tenantService: Tenant
  ) {}

  ngOnInit() {
    this.tenantService.getAll().subscribe({
      next: d => this.tenants = d
    });
    if (this.payment) {
      this.form = {
        tenant_id:    this.payment.tenant_id,
        property_id:  this.payment.property_id,
        amount:       this.payment.amount,
        payment_date: this.payment.payment_date?.substring(0,10) || '',
        due_date:     this.payment.due_date?.substring(0,10) || '',
        status:       this.payment.status,
        notes:        this.payment.notes || ''
      };
    }
  }

  onTenantChange() {
    const t = this.tenants.find(x => x.id == this.form.tenant_id);
    if (t) this.form.property_id = t.property_id;
  }

  onSubmit() {
    this.loading = true;
    this.error   = '';
    const req = this.payment
      ? this.paymentService.update(this.payment.id, this.form)
      : this.paymentService.create(this.form);
    req.subscribe({
      next: () => { this.loading = false; this.saved.emit(); },
      error: (err) => {
        this.error = err.error?.message || 'Failed';
        this.loading = false;
      }
    });
  }
  onCancel() { this.cancelled.emit(); }
}

