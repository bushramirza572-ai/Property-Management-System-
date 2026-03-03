import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './property-form.html',
  styleUrl: './property-form.scss',
})
export class PropertyForm implements OnInit{
  form = {
    name: '',
    address: '',
    type: 'Apartment',
    rent_amount: 0,
    status: 'available'
  };

  property: any = null;
  error = '';
  loading = false;
  isEditMode = false;

  constructor(
    private propService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.loading = true;

      this.propService.getById(+id).subscribe({
        next: (data) => {
          this.property = data;
          this.form = {
            name: data.name,
            address: data.address,
            type: data.type,
            rent_amount: data.rent_amount,
            status: data.status
          };
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Failed to load property.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    const request = this.isEditMode
      ? this.propService.update(this.property.id, this.form)
      : this.propService.create(this.form);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/properties']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Operation failed';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/properties']);
  }
}