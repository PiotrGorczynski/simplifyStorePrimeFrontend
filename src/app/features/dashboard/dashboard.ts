import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarComponent } from '../../components/layout/sidebar/sidebar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

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
    SidebarComponent,
    FormsModule,
    DialogModule,
    RadioButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  displayDialog: boolean = false;
  newProduct: any = {
    info: '',
    salesOrder: '',
    invoices: 'no',
    paymentHistory: 'no',
    communication: '',
    category: '',
    feedback: '',
    notes: '',
    supportRequests: ''
  };

  yesNoOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  orderOptions = [
    { label: 'Order', value: 'order' },
    { label: 'Service', value: 'service' },
    { label: 'Bulk', value: 'bulk' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Periodic', value: 'periodic' },
    { label: 'B2B', value: 'B2B' }
  ];

  categoryOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Business', value: 'business' },
    { label: 'Detail', value: 'detail' },
    { label: 'Wholesalers', value: 'wholesalers' },
    { label: 'Retail Chains', value: 'retail chains' }
  ];
  constructor(private router: Router) {}

  ngOnInit() {
    this.products = [
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 5,
        info: 'New Info 5',
        salesOrder: 'bulk',
        invoices: 'no',
        paymentHistory: 'no',
        communication: 'call scheduled',
        category: 'individual',
        feedback: 'Wait for reply',
        notes: 'Requires follow-up',
        supportRequests: '1 pending'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'New Info 4',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'newcustomer...',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      }
    ];
  }
  showDialog() {
    this.newProduct = { id: null, info: '', salesOrder: '', invoices: 'no', category: '' };
    this.displayDialog = true;
  }

  saveProduct() {
    if (this.newProduct.info) {
      const nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      this.products = [...this.products, { ...this.newProduct, id: nextId }];
      this.displayDialog = false;
    }
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    console.log('Deleted record with ID: ', id);
  }

  onLogout() {
    console.log('Logging out from Dashboard...');
    this.router.navigate(['/login']);
  }
}
