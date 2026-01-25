import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExportService } from '../../services/export.service';
import { fadeInOut } from '../../../animations';
import { ThemeService } from '../../services/theme.service';
import { ActionService, ActionType } from '../../services/action.service';
import { CustomerService, Customer } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

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
    FormsModule,
    DialogModule,
    RadioButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [ConfirmationService, MessageService],
  animations: [fadeInOut],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;

  customers: Customer[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedCustomerId: number | null = null;
  selectedCustomer: Customer | null = null;
  isDarkMode = false;
  submitted: boolean = false;
  searchValue: string = '';
  isLoading = false;

  private actionSubscription: Subscription | null = null;
  private loadingSubscription: Subscription | null = null;

  newCustomer: Partial<Customer> = {
    info: '',
    salesOrders: '',
    invoices: 'no',
    paymentHistory: 'no',
    communication: '',
    category: '',
    feedback: '',
    notes: '',
    supportRequest: 'None'
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
    private themeService: ThemeService,
    private actionService: ActionService,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.customerService.loading$.subscribe(
      loading => this.isLoading = loading
    );

    this.loadCustomers();

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.actionSubscription = this.actionService.action$.subscribe((action: ActionType) => {
      this.handleAction(action);
    });
  }

  ngOnDestroy() {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load customers',
          life: 5000
        });
        this.customers = [];
      }
    });
  }

  private handleAction(action: ActionType): void {
    switch (action) {
      case 'show':
        this.onShowCustomer();
        break;
      case 'insert':
        this.showDialog();
        break;
      case 'update':
        this.showUpdateDialog();
        break;
      case 'delete':
        this.deleteCustomer();
        break;
      case 'exportPdf':
        this.exportToPDF();
        break;
      case 'exportExcel':
        this.exportToExcel();
        break;
      case 'grid':
        this.exportToCSV();
        break;
      case 'code':
        this.exportToHTML();
        break;
      case 'database':
        this.exportToJSON();
        break;
      case 'logout':
        this.onLogout();
        break;
    }
  }

  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dt.filterGlobal('', 'contains');
  }

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.png' : 'logo.png';
  }

  showDialog() {
    this.isEditMode = false;
    this.selectedCustomerId = null;
    this.submitted = false;
    this.newCustomer = {
      info: '',
      salesOrders: '',
      invoices: 'no',
      paymentHistory: 'no',
      communication: '',
      category: '',
      feedback: '',
      notes: '',
      supportRequest: 'None'
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
    this.submitted = false;
    this.selectedCustomerId = this.selectedCustomer.id;
    this.newCustomer = {
      info: this.selectedCustomer.info,
      salesOrders: this.selectedCustomer.salesOrders,
      invoices: this.selectedCustomer.invoices,
      paymentHistory: this.selectedCustomer.paymentHistory,
      communication: this.selectedCustomer.communication,
      category: this.selectedCustomer.category,
      feedback: this.selectedCustomer.feedback,
      notes: this.selectedCustomer.notes,
      supportRequest: this.selectedCustomer.supportRequest
    };
    this.displayDialog = true;
  }

  saveCustomer() {
    this.submitted = true;
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
      this.customerService.update(this.selectedCustomerId, this.newCustomer).subscribe({
        next: (updatedCustomer) => {
          const index = this.customers.findIndex(c => c.id === this.selectedCustomerId);
          if (index !== -1) {
            this.customers[index] = updatedCustomer;
            this.customers = [...this.customers];
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Customer updated successfully',
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update customer',
            life: 5000
          });
        }
      });
    } else {
      this.customerService.create(this.newCustomer as Omit<Customer, 'id'>).subscribe({
        next: (createdCustomer) => {
          this.customers = [...this.customers, createdCustomer];
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `Customer ${createdCustomer.info} added successfully`,
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to create customer',
            life: 5000
          });
        }
      });
    }
  }

  deleteCustomer() {
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
        this.customerService.delete(this.selectedCustomer!.id).subscribe({
          next: () => {
            this.customers = this.customers.filter(c => c.id !== this.selectedCustomer!.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Customer deleted successfully',
              life: 3000
            });
            this.selectedCustomer = null;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete customer',
              life: 5000
            });
          }
        });
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
    this.submitted = false;
    this.displayDialog = false;
  }

  isFormValid(): boolean {
    return !!(
      this.newCustomer.info &&
      this.newCustomer.info.trim() !== '' &&
      this.newCustomer.salesOrders &&
      this.newCustomer.category &&
      this.isEmailValid()
    );
  }

  isEmailValid(): boolean {
    if (!this.newCustomer.communication || !this.newCustomer.communication.trim()) {
      return false;
    }
    return this.isValidEmailFormat();
  }

  isValidEmailFormat(): boolean {
    if (!this.newCustomer.communication) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.newCustomer.communication);
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
        const username = this.authService.getUsername() || 'User';

        this.messageService.add({
          severity: 'info',
          summary: 'Logged Out',
          detail: `Goodbye, ${username}! See you soon.`,
          life: 2000
        });

        setTimeout(() => {
          this.authService.logout();
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

  exportToPDF() {
    this.exportService.exportToPDF(this.customers, 'customers', 'Customer List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to PDF successfully',
      life: 2000
    });
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.customers, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to Excel successfully',
      life: 2000
    });
  }

  exportToCSV() {
    this.exportService.exportToCSV(this.customers, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to CSV successfully',
      life: 2000
    });
  }

  exportToJSON() {
    this.exportService.exportToJSON(this.customers, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to JSON successfully',
      life: 2000
    });
  }

  exportToHTML() {
    this.exportService.exportToHTML(this.customers, 'customers', 'Customer List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to HTML successfully',
      life: 2000
    });
  }
}
