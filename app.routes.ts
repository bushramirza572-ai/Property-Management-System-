import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  // Redirect root to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Public Routes
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.Register)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  // Protected Dashboard
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  // Properties List (Login Required)
  {
    path: 'properties',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/properties/property-list/property-list')
        .then(m => m.PropertyList)
  },

  // Add Property (Admin Only)
  {
    path: 'properties/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/properties/property-form/property-form')
        .then(m => m.PropertyForm)
  },

  // Edit Property (Admin Only) ✅ EDIT BUTTON ROUTE
  {
    path: 'properties/edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/properties/property-form/property-form')
        .then(m => m.PropertyForm)
  },

  // Tenants
  {
    path: 'tenants',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tenants/tenant-list/tenant-list')
        .then(m => m.TenantList)
  },

  // Payments
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/payments/payment-list/payment-list')
        .then(m => m.PaymentList)
  },

  // Profile
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile')
        .then(m => m.Profile)
  },

  // Wildcard → Redirect to Dashboard
  { path: '**', redirectTo: '/dashboard' }

];