import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import {ProductComponent} from './features/product/product';
import {DeliveryComponent} from './features/delivery/delivery';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'product', component: ProductComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: '**', redirectTo: '/login' }
];
