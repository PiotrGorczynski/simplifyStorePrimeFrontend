import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import {ProductComponent} from './features/product/product';
import {DeliveryComponent} from './features/delivery/delivery';
import {TransactionComponent} from './features/transaction/transaction';
import {AnalyticsComponent} from './analytics/analytics';
import { authGuard } from './guards/auth-guard.spec';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password';
import { SignUpComponent } from './login/sign-up/sign-up';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  { path: 'product', component: ProductComponent, canActivate: [authGuard]},
  { path: 'transaction', component: TransactionComponent, canActivate: [authGuard]},
  { path: 'delivery', component: DeliveryComponent, canActivate: [authGuard]},
  { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: '/login' }
];
