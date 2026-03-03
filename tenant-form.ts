import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/services/user';
import { PropertyService } from '../../../core/services/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tenant-form.html'
})
export class TenantForm implements OnInit {

  @Input() tenant: any;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  tenantForm!: FormGroup;

  users: any[] = [];
  properties: any[] = [];
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private userService: User,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      user_id: ['', Validators.required],
      property_id: ['', Validators.required],
      phone: [''],
      lease_start: [''],
      lease_end: ['']
    });

    this.loadUsers();
    this.loadProperties();
  }

  loadUsers() {
    this.userService.getAll().subscribe((res: any) => {
      this.users = res;
    });
  }

  loadProperties() {
    this.propertyService.getAll().subscribe((res: any) => {
      this.properties = res;
    });
  }

  onSubmit() {
    if (this.tenantForm.invalid) return;

    this.save.emit(this.tenantForm.value);
  }

  onCancel() {
    this.cancel.emit();
  }
}