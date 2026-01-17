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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportService } from '../../services/export.service';
import { fadeInOut } from '../../../animations';
import { ThemeService } from '../../services/theme.service';

interface Customer {
  id: number;
  info: string;
  salesOrder: string;
  invoices: string;
  paymentHistory: string;
  communication: string;
  category: string;
  feedback: string;
  notes: string;
  supportRequests: string;
}

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
    SelectModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  animations: [fadeInOut],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  products: Customer[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedCustomerId: number | null = null;
  selectedCustomer: Customer | null = null;
  isDarkMode = false;

  newProduct: Partial<Customer> = {
    info: '',
    salesOrder: '',
    invoices: 'no',
    paymentHistory: 'no',
    communication: '',
    category: '',
    feedback: '',
    notes: '',
    supportRequests: 'None'
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

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private exportService: ExportService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.products = [
      {
        id: 1,
        info: 'Customer Alpha',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'alpha@example.com',
        category: 'retail chains',
        feedback: 'Great service',
        notes: 'Standard customer',
        supportRequests: 'None'
      },
      {
        id: 2,
        info: 'Customer Beta',
        salesOrder: 'bulk',
        invoices: 'no',
        paymentHistory: 'no',
        communication: 'beta@example.com',
        category: 'individual',
        feedback: 'Wait for reply',
        notes: 'Requires follow-up',
        supportRequests: '1 pending'
      },
      {
        id: 3,
        info: 'Customer Gamma',
        salesOrder: 'order',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'gamma@example.com',
        category: 'business',
        feedback: 'Excellent',
        notes: 'Premium client',
        supportRequests: 'None'
      },
      {
        id: 4,
        info: 'Customer Delta',
        salesOrder: 'subscription',
        invoices: 'yes',
        paymentHistory: 'no',
        communication: 'delta@example.com',
        category: 'wholesalers',
        feedback: 'Good',
        notes: 'Monthly subscription',
        supportRequests: 'None'
      },
      {
        id: 5,
        info: 'Customer Epsilon',
        salesOrder: 'periodic',
        invoices: 'no',
        paymentHistory: 'yes',
        communication: 'epsilon@example.com',
        category: 'detail',
        feedback: 'Satisfactory',
        notes: 'Seasonal orders',
        supportRequests: '2 pending'
      },
      {
        id: 6,
        info: 'Customer Zeta',
        salesOrder: 'B2B',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'zeta@example.com',
        category: 'retail chains',
        feedback: 'Outstanding',
        notes: 'Corporate account',
        supportRequests: 'None'
      },
      {
        id: 7,
        info: 'Customer Eta',
        salesOrder: 'service',
        invoices: 'no',
        paymentHistory: 'no',
        communication: 'eta@example.com',
        category: 'individual',
        feedback: 'Needs improvement',
        notes: 'First time buyer',
        supportRequests: '1 pending'
      },
      {
        id: 8,
        info: 'Customer Theta',
        salesOrder: 'bulk',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'theta@example.com',
        category: 'wholesalers',
        feedback: 'Very good',
        notes: 'Bulk orders only',
        supportRequests: 'None'
      },
      {
        id: 9,
        info: 'Customer Iota',
        salesOrder: 'order',
        invoices: 'yes',
        paymentHistory: 'no',
        communication: 'iota@example.com',
        category: 'business',
        feedback: 'Satisfied',
        notes: 'Regular customer',
        supportRequests: 'None'
      },
      {
        id: 10,
        info: 'Customer Kappa',
        salesOrder: 'subscription',
        invoices: 'no',
        paymentHistory: 'yes',
        communication: 'kappa@example.com',
        category: 'retail chains',
        feedback: 'Good experience',
        notes: 'Annual subscription',
        supportRequests: '3 pending'
      },
      {
        id: 11,
        info: 'Customer Lambda',
        salesOrder: 'service',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'lambda@example.com',
        category: 'business',
        feedback: 'Exceptional service',
        notes: 'VIP customer',
        supportRequests: 'None'
      },
      {
        id: 12,
        info: 'Customer Mu',
        salesOrder: 'bulk',
        invoices: 'no',
        paymentHistory: 'yes',
        communication: 'mu@example.com',
        category: 'wholesalers',
        feedback: 'Reliable partner',
        notes: 'Large volume orders',
        supportRequests: 'None'
      },
      {
        id: 13,
        info: 'Customer Nu',
        salesOrder: 'order',
        invoices: 'yes',
        paymentHistory: 'no',
        communication: 'nu@example.com',
        category: 'individual',
        feedback: 'Happy customer',
        notes: 'Occasional buyer',
        supportRequests: '1 pending'
      },
      {
        id: 14,
        info: 'Customer Xi',
        salesOrder: 'periodic',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'xi@example.com',
        category: 'retail chains',
        feedback: 'Professional',
        notes: 'Quarterly orders',
        supportRequests: 'None'
      },
      {
        id: 15,
        info: 'Customer Omicron',
        salesOrder: 'B2B',
        invoices: 'no',
        paymentHistory: 'no',
        communication: 'omicron@example.com',
        category: 'detail',
        feedback: 'Under evaluation',
        notes: 'New business partner',
        supportRequests: '2 pending'
      },
      {
        id: 16,
        info: 'Customer Pi',
        salesOrder: 'subscription',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'pi@example.com',
        category: 'business',
        feedback: 'Loyal customer',
        notes: 'Long-term contract',
        supportRequests: 'None'
      },
      {
        id: 17,
        info: 'Customer Rho',
        salesOrder: 'service',
        invoices: 'no',
        paymentHistory: 'yes',
        communication: 'rho@example.com',
        category: 'individual',
        feedback: 'Positive feedback',
        notes: 'Repeat customer',
        supportRequests: 'None'
      },
      {
        id: 18,
        info: 'Customer Sigma',
        salesOrder: 'bulk',
        invoices: 'yes',
        paymentHistory: 'no',
        communication: 'sigma@example.com',
        category: 'wholesalers',
        feedback: 'Excellent communication',
        notes: 'Distributor',
        supportRequests: '1 pending'
      },
      {
        id: 19,
        info: 'Customer Tau',
        salesOrder: 'order',
        invoices: 'yes',
        paymentHistory: 'yes',
        communication: 'tau@example.com',
        category: 'retail chains',
        feedback: 'Very satisfied',
        notes: 'Multi-location client',
        supportRequests: 'None'
      },
      {
        id: 20,
        info: 'Customer Upsilon',
        salesOrder: 'periodic',
        invoices: 'no',
        paymentHistory: 'yes',
        communication: 'upsilon@example.com',
        category: 'business',
        feedback: 'Good partnership',
        notes: 'Strategic account',
        supportRequests: '4 pending'
      }
    ];
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.png' : 'logo.png';
  }

  showDialog() {
    this.isEditMode = false;
    this.selectedCustomerId = null;
    this.newProduct = {
      info: '',
      salesOrder: '',
      invoices: 'no',
      paymentHistory: 'no',
      communication: '',
      category: '',
      feedback: '',
      notes: '',
      supportRequests: 'None'
    };
    this.displayDialog = true;
  }

  showUpdateDialog() {
    if (!this.selectedCustomer) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a customer first',
        life: 3000
      });
      return;
    }

    this.isEditMode = true;
    this.selectedCustomerId = this.selectedCustomer.id;
    this.newProduct = {
      info: this.selectedCustomer.info,
      salesOrder: this.selectedCustomer.salesOrder,
      invoices: this.selectedCustomer.invoices,
      paymentHistory: this.selectedCustomer.paymentHistory,
      communication: this.selectedCustomer.communication,
      category: this.selectedCustomer.category,
      feedback: this.selectedCustomer.feedback,
      notes: this.selectedCustomer.notes,
      supportRequests: this.selectedCustomer.supportRequests
    };
    this.displayDialog = true;
  }

  saveProduct() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields',
        life: 3000
      });
      return;
    }

    if (this.isEditMode && this.selectedCustomerId) {
      const index = this.products.findIndex(p => p.id === this.selectedCustomerId);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...this.newProduct
        } as Customer;

        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Customer updated successfully',
          life: 3000
        });
      }
    } else {
      const nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      this.products = [...this.products, { ...this.newProduct, id: nextId } as Customer];

      this.messageService.add({
        severity: 'success',
        summary: 'Created',
        detail: `Customer ${this.newProduct.info} added successfully`,
        life: 3000
      });
    }

    this.displayDialog = false;
  }

  deleteProduct() {
    if (!this.selectedCustomer) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a customer first',
        life: 3000
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedCustomer.info}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.products = this.products.filter(p => p.id !== this.selectedCustomer!.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Customer deleted successfully',
          life: 3000
        });
        this.selectedCustomer = null;
      }
    });
  }

  onShowCustomer() {
    if (!this.selectedCustomer) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a customer first',
        life: 3000
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Customer Details',
      detail: `${this.selectedCustomer.info} - ${this.selectedCustomer.category}`,
      life: 3000
    });
  }

  closeDialog() {
    this.displayDialog = false;
  }

  isFormValid(): boolean {
    return !!(
      this.newProduct.info &&
      this.newProduct.info.trim() !== '' &&
      this.newProduct.salesOrder &&
      this.newProduct.category
    );
  }

  getDialogHeader(): string {
    return this.isEditMode ? 'Update Customer Entry' : 'Add New Customer Entry';
  }

  getSaveButtonLabel(): string {
    return this.isEditMode ? 'Update Entry' : 'Save Entry';
  }

  onLogout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Logout Confirmation',
      icon: 'pi pi-sign-out',
      accept: () => {
        const username = localStorage.getItem('username') || 'User';

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('loginTime');

        this.messageService.add({
          severity: 'info',
          summary: 'Logged Out',
          detail: `Goodbye, ${username}! See you soon.`,
          life: 2000
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Logout cancelled',
          life: 1500
        });
      }
    });
  }

  exportToXLS() {
    this.exportService.exportToXLS(this.products, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to XLS successfully',
      life: 2000
    });
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.products, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to Excel successfully',
      life: 2000
    });
  }

  exportToCSV() {
    this.exportService.exportToCSV(this.products, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to CSV successfully',
      life: 2000
    });
  }

  exportToJSON() {
    this.exportService.exportToJSON(this.products, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to JSON successfully',
      life: 2000
    });
  }

  exportToHTML() {
    this.exportService.exportToHTML(this.products, 'customers', 'Customer List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to HTML successfully',
      life: 2000
    });
  }
}
