import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { TenantForm } from '../tenant-form/tenant-form';
import { Tenant } from '../../../core/services/tenant';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TenantForm],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss',
})
export class TenantList implements OnInit{

  tenants: any[] = [];
  loading = false;
  showForm = false;
  selectedTenant: any = null;

  constructor(
    private tenantService: Tenant,
    private authservice: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  isAdmin(): boolean{
    return this.authservice.isAdmin();
  }
  
  ngOnInit() {
    this.loadTenants();
  }

   loadTenants() {
  this.loading = true;

  const request$ = this.isAdmin()
    ? this.tenantService.getAll()
    : this.tenantService.getMyTenants();

  request$.subscribe({
    next: (data) => {
      console.log('Tenants from backend:', data);
      this.tenants = data;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error loading tenants:', err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  openCreate() {
    this.selectedTenant = null;
    this.showForm = true;
  }

  openEdit(t: any) {
    this.selectedTenant = { ...t };
    this.showForm = true;
  }

  addTenant(formData: any) {

    this.tenantService.create(formData).subscribe({
      next: (res) => {
        console.log('Tenant saved:', res);
        this.showForm = false;
        this.loadTenants();   // reload from backend
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving tenant:', err);
        this.cdr.detectChanges();
      }
    });
  }

  closeForm() {
    this.showForm = false;
  }

 onDelete(id: number) {

  if (!confirm('Remove this tenant?')) return;

  this.tenantService.delete(id).subscribe({
    next: () => {
      this.loadTenants();
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error deleting tenant:', err);
      this.cdr.detectChanges();
    }
  });
}
}