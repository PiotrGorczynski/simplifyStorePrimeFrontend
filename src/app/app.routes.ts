import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent }
    ]
  }
];
