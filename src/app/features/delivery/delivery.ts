import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExportService } from '../../services/export.service';
import { ThemeService } from '../../services/theme.service';
import { ActionService, ActionType } from '../../services/action.service';

interface DeliveryModel {
  id: number;
  deliveryType: string;
  status: string;
  provider: string;
  transactionId: number;
}

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
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './delivery.html',
  styleUrl: './delivery.scss'
})
export class DeliveryComponent implements OnInit, OnDestroy {
  deliveries: DeliveryModel[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedDeliveryId: number | null = null;
  selectedDelivery: DeliveryModel | null = null;
  isDarkMode = false;

  private actionSubscription: Subscription | null = null;

  newDelivery: Partial<DeliveryModel> = {
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
    private actionService: ActionService
  ) {}

  ngOnInit() {
    this.deliveries = [
      { id: 1, deliveryType: 'express', status: 'delivered', provider: 'DHL', transactionId: 5 },
      { id: 2, deliveryType: 'standard', status: 'in transit', provider: 'FedEx', transactionId: 12 },
      { id: 3, deliveryType: 'in-store pickup', status: 'pending', provider: 'InPost', transactionId: 8 },
      { id: 4, deliveryType: 'international', status: 'delivered', provider: 'DHL', transactionId: 3 },
      { id: 5, deliveryType: 'express', status: 'out for delivery', provider: 'UPS', transactionId: 15 },
      { id: 6, deliveryType: 'standard', status: 'delivered', provider: 'USPS', transactionId: 7 },
      { id: 7, deliveryType: 'weekend delivery', status: 'in transit', provider: 'DPD', transactionId: 20 },
      { id: 8, deliveryType: 'scheduled', status: 'pending', provider: 'Poczta Polska', transactionId: 11 },
      { id: 9, deliveryType: 'express', status: 'failed', provider: 'FedEx', transactionId: 9 },
      { id: 10, deliveryType: 'standard', status: 'delivered', provider: 'DHL', transactionId: 14 },
      { id: 11, deliveryType: 'in-store pickup', status: 'delivered', provider: 'InPost', transactionId: 6 },
      { id: 12, deliveryType: 'international', status: 'in transit', provider: 'DHL', transactionId: 18 },
      { id: 13, deliveryType: 'express', status: 'cancelled', provider: 'UPS', transactionId: 2 },
      { id: 14, deliveryType: 'standard', status: 'returned', provider: 'USPS', transactionId: 13 },
      { id: 15, deliveryType: 'weekend delivery', status: 'delivered', provider: 'DPD', transactionId: 10 },
      { id: 16, deliveryType: 'scheduled', status: 'in transit', provider: 'Amazon Logistics', transactionId: 16 },
      { id: 17, deliveryType: 'express', status: 'out for delivery', provider: 'DHL', transactionId: 4 },
      { id: 18, deliveryType: 'standard', status: 'pending', provider: 'FedEx', transactionId: 19 },
      { id: 19, deliveryType: 'in-store pickup', status: 'delivered', provider: 'InPost', transactionId: 1 },
      { id: 20, deliveryType: 'international', status: 'delivered', provider: 'DHL', transactionId: 17 }
    ];

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
      case 'exportExcel':
        this.exportToExcel();
        break;
      case 'grid':
        this.exportToPDF();
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

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.png' : 'logo.png';
  }

  showDialog() {
    this.isEditMode = false;
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
      const index = this.deliveries.findIndex(d => d.id === this.selectedDeliveryId);
      if (index !== -1) {
        this.deliveries[index] = {
          ...this.deliveries[index],
          ...this.newDelivery
        } as DeliveryModel;

        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Delivery updated successfully',
          life: 3000
        });
      }
    } else {
      const nextId = this.deliveries.length > 0 ? Math.max(...this.deliveries.map(d => d.id)) + 1 : 1;
      this.deliveries = [...this.deliveries, { ...this.newDelivery, id: nextId } as DeliveryModel];

      this.messageService.add({
        severity: 'success',
        summary: 'Created',
        detail: `Delivery for Transaction #${this.newDelivery.transactionId} added successfully`,
        life: 3000
      });
    }

    this.displayDialog = false;
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
        this.deliveries = this.deliveries.filter(d => d.id !== this.selectedDelivery!.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Delivery deleted successfully',
          life: 3000
        });
        this.selectedDelivery = null;
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
    this.exportService.exportToPDF(this.deliveries, 'transactions', 'Transaction List');
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
