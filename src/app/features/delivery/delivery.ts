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
import { ThemeService } from '../../services/theme.service';
import { ActionService, ActionType } from '../../services/action.service';
import { DeliveryService, Delivery } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-delivery',
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
  templateUrl: './delivery.html',
  styleUrl: './delivery.scss'
})
export class DeliveryComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;
  deliveries: Delivery[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedDeliveryId: number | null = null;
  selectedDelivery: Delivery | null = null;
  isDarkMode = false;
  submitted: boolean = false;
  searchValue: string = '';
  isLoading = false;

  private actionSubscription: Subscription | null = null;
  private loadingSubscription: Subscription | null = null;

  newDelivery: Partial<Delivery> = {
    deliveryType: '',
    status: '',
    provider: '',
    transactionId: undefined
  };

  deliveryTypeOptions = [
    { label: 'Express', value: 'express' },
    { label: 'Standard', value: 'standard' },
    { label: 'In-Store Pickup', value: 'in-store pickup' },
    { label: 'International', value: 'international' },
    { label: 'Weekend Delivery', value: 'weekend delivery' },
    { label: 'Scheduled', value: 'scheduled' }
  ];

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Transit', value: 'in transit' },
    { label: 'Out for Delivery', value: 'out for delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Failed', value: 'failed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Returned', value: 'returned' }
  ];

  providerOptions = [
    { label: 'DHL', value: 'DHL' },
    { label: 'FedEx', value: 'FedEx' },
    { label: 'UPS', value: 'UPS' },
    { label: 'USPS', value: 'USPS' },
    { label: 'DPD', value: 'DPD' },
    { label: 'InPost', value: 'InPost' },
    { label: 'Poczta Polska', value: 'Poczta Polska' },
    { label: 'Amazon Logistics', value: 'Amazon Logistics' }
  ];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private exportService: ExportService,
    private themeService: ThemeService,
    private actionService: ActionService,
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.deliveryService.loading$.subscribe(
      loading => this.isLoading = loading
    );

    this.loadDeliveries();

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

  loadDeliveries(): void {
    this.deliveryService.getAll().subscribe({
      next: (data) => {
        this.deliveries = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load deliveries',
          life: 5000
        });
        this.deliveries = [];
      }
    });
  }

  private handleAction(action: ActionType): void {
    switch (action) {
      case 'show':
        this.onShowDelivery();
        break;
      case 'insert':
        this.showDialog();
        break;
      case 'update':
        this.showUpdateDialog();
        break;
      case 'delete':
        this.deleteDelivery();
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
    this.submitted = false;
    this.selectedDeliveryId = null;
    this.newDelivery = {
      deliveryType: '',
      status: 'pending',
      provider: '',
      transactionId: undefined
    };
    this.displayDialog = true;
  }

  showUpdateDialog() {
    if (!this.selectedDelivery) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a delivery first',
        life: 3000
      });
      return;
    }

    this.isEditMode = true;
    this.submitted = false;
    this.selectedDeliveryId = this.selectedDelivery.id;
    this.newDelivery = {
      deliveryType: this.selectedDelivery.deliveryType,
      status: this.selectedDelivery.status,
      provider: this.selectedDelivery.provider,
      transactionId: this.selectedDelivery.transactionId
    };
    this.displayDialog = true;
  }

  saveDelivery() {
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

    if (this.isEditMode && this.selectedDeliveryId) {
      this.deliveryService.update(this.selectedDeliveryId, this.newDelivery).subscribe({
        next: (updatedDelivery) => {
          const index = this.deliveries.findIndex(d => d.id === this.selectedDeliveryId);
          if (index !== -1) {
            this.deliveries[index] = updatedDelivery;
            this.deliveries = [...this.deliveries];
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Delivery updated successfully',
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update delivery',
            life: 5000
          });
        }
      });
    } else {
      this.deliveryService.create(this.newDelivery as Omit<Delivery, 'id'>).subscribe({
        next: (createdDelivery) => {
          this.deliveries = [...this.deliveries, createdDelivery];
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `Delivery for Transaction #${createdDelivery.transactionId} added successfully`,
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to create delivery',
            life: 5000
          });
        }
      });
    }
  }

  deleteDelivery() {
    if (!this.selectedDelivery) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a delivery first',
        life: 3000
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete delivery for Transaction #${this.selectedDelivery.transactionId}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deliveryService.delete(this.selectedDelivery!.id).subscribe({
          next: () => {
            this.deliveries = this.deliveries.filter(d => d.id !== this.selectedDelivery!.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Delivery deleted successfully',
              life: 3000
            });
            this.selectedDelivery = null;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete delivery',
              life: 5000
            });
          }
        });
      }
    });
  }

  onShowDelivery() {
    if (!this.selectedDelivery) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a delivery first',
        life: 3000
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Delivery Details',
      detail: `Transaction #${this.selectedDelivery.transactionId} - ${this.selectedDelivery.provider} (${this.selectedDelivery.status})`,
      life: 3000
    });
  }

  closeDialog() {
    this.submitted = false;
    this.displayDialog = false;
  }

  isFormValid(): boolean {
    return !!(
      this.newDelivery.deliveryType &&
      this.newDelivery.status &&
      this.newDelivery.provider &&
      this.newDelivery.transactionId !== undefined &&
      this.newDelivery.transactionId > 0
    );
  }

  getDialogHeader(): string {
    return this.isEditMode ? 'Update Delivery Entry' : 'Add New Delivery Entry';
  }

  getSaveButtonLabel(): string {
    return this.isEditMode ? 'Update Entry' : 'Save Entry';
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'in transit':
      case 'out for delivery': return 'info';
      case 'pending': return 'warn';
      case 'failed':
      case 'cancelled':
      case 'returned': return 'danger';
      default: return 'secondary';
    }
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

  exportToExcel() {
    this.exportService.exportToExcel(this.deliveries, 'deliveries');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to Excel successfully',
      life: 2000
    });
  }

  exportToPDF() {
    this.exportService.exportToPDF(this.deliveries, 'deliveries', 'Delivery List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to PDF successfully',
      life: 2000
    });
  }

  exportToCSV() {
    this.exportService.exportToCSV(this.deliveries, 'deliveries');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to CSV successfully',
      life: 2000
    });
  }

  exportToJSON() {
    this.exportService.exportToJSON(this.deliveries, 'deliveries');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to JSON successfully',
      life: 2000
    });
  }

  exportToHTML() {
    this.exportService.exportToHTML(this.deliveries, 'deliveries', 'Delivery List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to HTML successfully',
      life: 2000
    });
  }
}
