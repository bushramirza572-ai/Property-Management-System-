import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
})
export class PropertyList implements OnInit {
  properties: any[] = [];
  loading = true;
  user: any = null;

  constructor(private propService: PropertyService,
     private router: Router,
     private authservice: AuthService,
     private cdr: ChangeDetectorRef
    ) {}

  ngOnInit() {
    this.user = this.authservice.getCurrentUser();
    this.loadProperties();
  }

  isAdmin(): boolean {
    return this.authservice.isAdmin(); 
  }

  loadProperties() {
    this.loading = true;
    this.propService.getAll().subscribe({
      next: (data: any[]) => { 
        this.properties = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading properties:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreate() { this.router.navigate(['/properties/new']); }
  openEdit(prop: any) { this.router.navigate(['/properties/edit', prop.id]); }

  onDelete(id: number) {
    if (!confirm('Delete this property?')) return;
    this.propService.delete(id).subscribe({
      next: () => this.loadProperties(),
      error: () => alert('Delete failed')
    });
  }
}