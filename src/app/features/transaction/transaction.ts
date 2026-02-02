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
import { DatePicker } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportService } from '../../services/export.service';
import { fadeInOut } from '../../../animations';
import { ThemeService } from '../../services/theme.service';
import { ActionType, ActionService } from '../../services/action.service';
import { Subscription } from 'rxjs';
import { TransactionService, Transaction, TransactionItem } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CustomerService, Customer } from '../../services/customer.service';
import { ProductService, Product } from '../../services/product.service';



@Component({
  selector: 'app-transaction',
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
    DatePicker,
    RippleModule,
    ProgressSpinnerModule
  ],
  providers: [ConfirmationService, MessageService],
  animations: [fadeInOut],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss'
})
export class TransactionComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;
  transactions: Transaction[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedTransactionId: number | null = null;
  selectedTransaction: Transaction | null = null;
  isDarkMode = false;
  submitted: boolean = false;
  searchValue: string = '';
  isLoading = false;

  private actionSubscription: Subscription | null = null;
  private loadingSubscription: Subscription | null = null;

  expandedRowIds: Set<number> = new Set();

  newTransaction: Partial<Transaction> = {
    date: new Date(),
    type: '',
    total: 0,
    paymentMethod: '',
    status: 'new',
    provider: '',
    customerId: undefined,
    customerInfo: '',
    employeeName: 'Piotr',
    items: []
  };

  currentItem: Partial<TransactionItem> = {
    productId: undefined,
    quantity: 1
  };

  typeOptions = [
    { label: 'Sale', value: 'sale' },
    { label: 'Return', value: 'return' },
    { label: 'Exchange', value: 'exchange' },
    { label: 'Refund', value: 'refund' }
  ];

  paymentMethodOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Credit Card', value: 'credit card' },
    { label: 'Debit Card', value: 'debit card' },
    { label: 'Bank Transfer', value: 'bank transfer' },
    { label: 'BLIK', value: 'BLIK' },
    { label: 'PayPal', value: 'PayPal' },
    { label: 'Cheque', value: 'cheque' }
  ];

  statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Transit', value: 'in transit' },
    { label: 'On Hold', value: 'on hold' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  customerOptions: { label: string; value: number; info: string }[] = [];

  productOptions: { label: string; value: number; name: string; code: string; price: number }[] = [];


  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private exportService: ExportService,
    private themeService: ThemeService,
    private actionService: ActionService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.transactionService.loading$.subscribe(
      loading => this.isLoading = loading
    );

    this.loadTransactions();
    this.loadCustomers();
    this.loadProducts();

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

  loadTransactions(): void {
    this.transactionService.getAll().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load transactions',
          life: 5000
        });
        this.transactions = [];
      }
    });
  }

  private handleAction(action: ActionType): void {
    switch (action) {
      case 'show':
        this.onShowTransaction();
        break;
      case 'insert':
        this.showDialog();
        break;
      case 'update':
        this.showUpdateDialog();
        break;
      case 'delete':
        this.deleteTransaction();
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

  toggleRow(transaction: Transaction) {
    if (this.expandedRowIds.has(transaction.id)) {
      this.expandedRowIds.delete(transaction.id);
    } else {
      this.expandedRowIds.add(transaction.id);
    }
  }

  isRowExpanded(transaction: Transaction): boolean {
    return this.expandedRowIds.has(transaction.id);
  }

  showDialog() {
    this.isEditMode = false;
    this.submitted = false;
    this.selectedTransactionId = null;
    this.newTransaction = {
      date: new Date(),
      type: 'sale',
      total: 0,
      paymentMethod: '',
      status: 'new',
      provider: '',
      customerId: undefined,
      customerInfo: '',
      employeeName: this.authService.getUsername() || 'User',
      items: []
    };
    this.displayDialog = true;
  }

  showUpdateDialog() {
    if (!this.selectedTransaction) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a transaction first',
        life: 3000
      });
      return;
    }

    this.isEditMode = true;
    this.submitted = false;
    this.selectedTransactionId = this.selectedTransaction.id;
    this.newTransaction = {
      date: new Date(this.selectedTransaction.date),
      type: this.selectedTransaction.type,
      total: this.selectedTransaction.total,
      paymentMethod: this.selectedTransaction.paymentMethod,
      status: this.selectedTransaction.status,
      provider: this.selectedTransaction.provider,
      customerId: this.selectedTransaction.customerId,
      customerInfo: this.selectedTransaction.customerInfo,
      employeeName: this.selectedTransaction.employeeName,
      items: [...this.selectedTransaction.items]
    };
    this.displayDialog = true;
  }

  addItemToTransaction() {
    if (!this.currentItem.productId || !this.currentItem.quantity || this.currentItem.quantity <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Item',
        detail: 'Please select a product and quantity',
        life: 3000
      });
      return;
    }

    const product = this.productOptions.find(p => p.value === this.currentItem.productId);
    if (!product) return;

    const item: TransactionItem = {
      productId: product.value,
      productName: product.name,
      productCode: product.code,
      quantity: this.currentItem.quantity!,
      pricePerUnit: product.price
    };

    this.newTransaction.items = [...(this.newTransaction.items || []), item];
    this.calculateTotal();

    this.currentItem = { productId: undefined, quantity: 1 };

    this.messageService.add({
      severity: 'success',
      summary: 'Item Added',
      detail: `${product.name} added to transaction`,
      life: 2000
    });
  }

  removeItemFromTransaction(index: number) {
    this.newTransaction.items = this.newTransaction.items?.filter((_, i) => i !== index) || [];
    this.calculateTotal();
  }

  calculateTotal() {
    const total = (this.newTransaction.items || []).reduce((sum, item) => {
      return sum + (item.quantity * item.pricePerUnit);
    }, 0);
    this.newTransaction.total = total;
  }

  saveTransaction() {
    this.submitted = true;
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields and add at least one item',
        life: 3000
      });
      return;
    }

    const customer = this.customerOptions.find(c => c.value === this.newTransaction.customerId);
    if (customer) {
      this.newTransaction.customerInfo = customer.info;
    }

    if (this.isEditMode && this.selectedTransactionId) {
      this.transactionService.update(this.selectedTransactionId, this.newTransaction).subscribe({
        next: (updatedTransaction) => {
          const index = this.transactions.findIndex(t => t.id === this.selectedTransactionId);
          if (index !== -1) {
            this.transactions[index] = updatedTransaction;
            this.transactions = [...this.transactions];
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Transaction updated successfully',
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update transaction',
            life: 5000
          });
        }
      });
    } else {
      this.transactionService.create(this.newTransaction as Omit<Transaction, 'id'>).subscribe({
        next: (createdTransaction) => {
          this.transactions = [...this.transactions, createdTransaction];
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `Transaction #${createdTransaction.id} created successfully`,
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to create transaction',
            life: 5000
          });
        }
      });
    }
  }

  deleteTransaction() {
    if (!this.selectedTransaction) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a transaction first',
        life: 3000
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete Transaction #${this.selectedTransaction.id}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.transactionService.delete(this.selectedTransaction!.id).subscribe({
          next: () => {
            this.transactions = this.transactions.filter(t => t.id !== this.selectedTransaction!.id);
            this.expandedRowIds.delete(this.selectedTransaction!.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Transaction deleted successfully',
              life: 3000
            });
            this.selectedTransaction = null;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete transaction',
              life: 5000
            });
          }
        });
      }
    });
  }

  onShowTransaction() {
    if (!this.selectedTransaction) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a transaction first',
        life: 3000
      });
      return;
    }

    this.toggleRow(this.selectedTransaction);
  }

  closeDialog() {
    this.submitted = false;
    this.displayDialog = false;
  }

  isFormValid(): boolean {
    return !!(
      this.newTransaction.customerId &&
      this.newTransaction.paymentMethod &&
      this.newTransaction.type &&
      this.newTransaction.provider &&
      this.newTransaction.provider.trim() !== '' &&
      this.newTransaction.items &&
      this.newTransaction.items.length > 0
    );
  }

  getDialogHeader(): string {
    return this.isEditMode ? 'Update Transaction Entry' : 'Add New Transaction Entry';
  }

  getSaveButtonLabel(): string {
    return this.isEditMode ? 'Update Entry' : 'Save Entry';
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in transit':
      case 'pending': return 'info';
      case 'new': return 'warn';
      case 'on hold':
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customerOptions = customers.map(c => ({
          label: c.info,
          value: c.id,
          info: c.info
        }));
      },
      error: (error) => {
        console.error('Failed to load customers', error);
      }
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productOptions = products.map(p => ({
          label: `${p.name} (${p.code})`,
          value: p.id,
          name: p.name,
          code: p.code,
          price: p.price
        }));
      },
      error: (error) => {
        console.error('Failed to load products', error);
      }
    });
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
    this.exportService.exportToPDF(this.transactions, 'transactions', 'Transaction List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to PDF successfully',
      life: 2000
    });
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.transactions, 'transactions');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to Excel successfully',
      life: 2000
    });
  }

  exportToCSV() {
    this.exportService.exportToCSV(this.transactions, 'transactions');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to CSV successfully',
      life: 2000
    });
  }

  exportToJSON() {
    this.exportService.exportToJSON(this.transactions, 'transactions');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to JSON successfully',
      life: 2000
    });
  }

  exportToHTML() {
    this.exportService.exportToHTML(this.transactions, 'transactions', 'Transaction List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to HTML successfully',
      life: 2000
    });
  }
}
