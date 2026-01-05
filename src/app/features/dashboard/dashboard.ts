import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarComponent } from '../../components/layout/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    TooltipModule,
    SidebarComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  constructor(private router: Router) {}

  ngOnInit() {
    this.products = [
      { id: 4, info: 'New Info 4', salesOrder: 'service', invoices: 'yes', category: 'retail chains' },
      { id: 5, info: 'New Info 5', salesOrder: 'bulk', invoices: 'no', category: 'individual' },
      { id: 54, info: 'info 5', salesOrder: 'order', invoices: 'yes', category: 'business' },
      { id: 6, info: 'New info 6', salesOrder: 'bulk', invoices: 'no', category: 'business' },
      { id: 4, info: 'New Info 4', salesOrder: 'service', invoices: 'yes', category: 'retail chains' },
      { id: 5, info: 'New Info 5', salesOrder: 'bulk', invoices: 'no', category: 'individual' },
      { id: 54, info: 'info 5', salesOrder: 'order', invoices: 'yes', category: 'business' },
      { id: 6, info: 'New info 6', salesOrder: 'bulk', invoices: 'no', category: 'business' },
      { id: 4, info: 'New Info 4', salesOrder: 'service', invoices: 'yes', category: 'retail chains' },
      { id: 5, info: 'New Info 5', salesOrder: 'bulk', invoices: 'no', category: 'individual' },
      { id: 54, info: 'info 5', salesOrder: 'order', invoices: 'yes', category: 'business' },
      { id: 6, info: 'New info 6', salesOrder: 'bulk', invoices: 'no', category: 'business' },
      { id: 7, info: 'New info 7', salesOrder: 'service', invoices: 'yes', category: 'detail' }
    ];
  }
  onLogout() {
    console.log('Logging out from Dashboard...');
    this.router.navigate(['/login']);
  }
}
