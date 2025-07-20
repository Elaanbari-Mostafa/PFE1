import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { NotAuthGuard } from './core/guards/notAuth.guard';
import { UserGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent),
    canActivate: [NotAuthGuard]
  },
  {
    path: 'pricing',
    loadComponent: () => import('./features/pricing/pricing.component')
      .then(m => m.PricingComponent),
    canActivate: [NotAuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.authRoutes),
    canActivate: [NotAuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/user/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'portfolio-builder',
    loadChildren: () => import('./features/user/portfolio-builder/portfolio-builder.routes')
      .then(m => m.portfolioBuilderRoutes),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'subscription',
    loadComponent: () => import('./features/user/subscription-management/subscription-management.component')
      .then(m => m.SubscriptionManagementComponent),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'themes',
    loadComponent: () => import('./features/user/theme-management/theme-management.component')
      .then(m => m.ThemeManagementComponent),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/user/profile-management/profile-management.component')
      .then(m => m.ProfileManagementComponent),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.adminRoutes),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];