import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ProductComponent } from './features/product/product';
import { DeliveryComponent } from './features/delivery/delivery';
import { TransactionComponent } from './features/transaction/transaction';
import { AnalyticsComponent } from './analytics/analytics';
import { authGuard } from './guards/auth-guard';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password';
import { SignUpComponent } from './login/sign-up/sign-up';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout';
import { NotFoundComponent } from './not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product', component: ProductComponent },
      { path: 'transaction', component: TransactionComponent },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'analytics', component: AnalyticsComponent },
    ]
  },
  { path: '**', component: NotFoundComponent }
];
