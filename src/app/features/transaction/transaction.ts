import { Component, OnInit } from '@angular/core';
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
import { DatePicker } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportService } from '../../services/export.service';
import { fadeInOut } from '../../../animations';
import { ThemeService } from '../../services/theme.service';

interface TransactionItemModel {
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  pricePerUnit: number;
}

interface TransactionModel {
  id: number;
  date: Date;
  type: string;
  total: number;
  paymentMethod: string;
  status: string;
  provider: string;
  customerId: number;
  customerInfo: string;
  employeeName: string;
  items: TransactionItemModel[];
}

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
    RippleModule
  ],
  providers: [ConfirmationService, MessageService],
  animations: [fadeInOut],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss'
})
export class TransactionComponent implements OnInit {
  transactions: TransactionModel[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedTransactionId: number | null = null;
  selectedTransaction: TransactionModel | null = null;
  isDarkMode = false;
  submitted: boolean = false;

  expandedRowIds: Set<number> = new Set();

  newTransaction: Partial<TransactionModel> = {
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

  currentItem: Partial<TransactionItemModel> = {
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

  customerOptions = [
    { label: 'Customer Alpha', value: 1, info: 'Customer Alpha' },
    { label: 'Customer Beta', value: 2, info: 'Customer Beta' },
    { label: 'Customer Gamma', value: 3, info: 'Customer Gamma' },
    { label: 'Customer Delta', value: 4, info: 'Customer Delta' },
    { label: 'Customer Epsilon', value: 5, info: 'Customer Epsilon' }
  ];

  productOptions = [
    { label: 'Laptop Pro 15 (LAP-001)', value: 1, name: 'Laptop Pro 15', code: 'LAP-001', price: 1299.99 },
    { label: 'Wireless Mouse (MSE-002)', value: 2, name: 'Wireless Mouse', code: 'MSE-002', price: 29.99 },
    { label: 'Office Chair (CHR-003)', value: 3, name: 'Office Chair', code: 'CHR-003', price: 249.99 },
    { label: 'T-Shirt Cotton (TSH-004)', value: 4, name: 'T-Shirt Cotton', code: 'TSH-004', price: 19.99 },
    { label: 'Notebook A4 (NTB-005)', value: 5, name: 'Notebook A4', code: 'NTB-005', price: 4.99 },
    { label: 'Coffee Maker (COF-006)', value: 6, name: 'Coffee Maker', code: 'COF-006', price: 79.99 },
    { label: 'Running Shoes (SHO-007)', value: 7, name: 'Running Shoes', code: 'SHO-007', price: 89.99 },
    { label: 'Screwdriver Set (TOL-008)', value: 8, name: 'Screwdriver Set', code: 'TOL-008', price: 24.99 }
  ];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private exportService: ExportService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.transactions = [
      {
        id: 1,
        date: new Date('2024-01-15'),
        type: 'sale',
        total: 2749.93,
        paymentMethod: 'credit card',
        status: 'completed',
        provider: 'Stripe',
        customerId: 1,
        customerInfo: 'Customer Alpha',
        employeeName: 'Piotr',
        items: [
          { productId: 1, productName: 'Laptop Pro 15', productCode: 'LAP-001', quantity: 2, pricePerUnit: 1299.99 },
          { productId: 2, productName: 'Wireless Mouse', productCode: 'MSE-002', quantity: 5, pricePerUnit: 29.99 }
        ]
      },
      {
        id: 2,
        date: new Date('2024-01-16'),
        type: 'sale',
        total: 249.99,
        paymentMethod: 'cash',
        status: 'completed',
        provider: 'In-Store',
        customerId: 2,
        customerInfo: 'Customer Beta',
        employeeName: 'Piotr',
        items: [
          { productId: 3, productName: 'Office Chair', productCode: 'CHR-003', quantity: 1, pricePerUnit: 249.99 }
        ]
      },
      {
        id: 3,
        date: new Date('2024-01-17'),
        type: 'sale',
        total: 224.91,
        paymentMethod: 'BLIK',
        status: 'pending',
        provider: 'Payment Gateway',
        customerId: 3,
        customerInfo: 'Customer Gamma',
        employeeName: 'Piotr',
        items: [
          { productId: 4, productName: 'T-Shirt Cotton', productCode: 'TSH-004', quantity: 10, pricePerUnit: 19.99 },
          { productId: 5, productName: 'Notebook A4', productCode: 'NTB-005', quantity: 5, pricePerUnit: 4.99 }
        ]
      },
      {
        id: 4,
        date: new Date('2024-01-18'),
        type: 'sale',
        total: 79.99,
        paymentMethod: 'debit card',
        status: 'completed',
        provider: 'Square',
        customerId: 4,
        customerInfo: 'Customer Delta',
        employeeName: 'Piotr',
        items: [
          { productId: 6, productName: 'Coffee Maker', productCode: 'COF-006', quantity: 1, pricePerUnit: 79.99 }
        ]
      },
      {
        id: 5,
        date: new Date('2024-01-19'),
        type: 'sale',
        total: 539.88,
        paymentMethod: 'credit card',
        status: 'in transit',
        provider: 'PayPal',
        customerId: 5,
        customerInfo: 'Customer Epsilon',
        employeeName: 'Piotr',
        items: [
          { productId: 7, productName: 'Running Shoes', productCode: 'SHO-007', quantity: 4, pricePerUnit: 89.99 },
          { productId: 8, productName: 'Screwdriver Set', productCode: 'TOL-008', quantity: 6, pricePerUnit: 24.99 }
        ]
      },
      {
        id: 6,
        date: new Date('2024-01-20'),
        type: 'return',
        total: -1299.99,
        paymentMethod: 'credit card',
        status: 'completed',
        provider: 'Refund',
        customerId: 1,
        customerInfo: 'Customer Alpha',
        employeeName: 'Piotr',
        items: [
          { productId: 1, productName: 'Laptop Pro 15', productCode: 'LAP-001', quantity: 1, pricePerUnit: 1299.99 }
        ]
      },
      {
        id: 7,
        date: new Date('2024-01-21'),
        type: 'sale',
        total: 149.95,
        paymentMethod: 'bank transfer',
        status: 'pending',
        provider: 'Wire Transfer',
        customerId: 2,
        customerInfo: 'Customer Beta',
        employeeName: 'Piotr',
        items: [
          { productId: 2, productName: 'Wireless Mouse', productCode: 'MSE-002', quantity: 5, pricePerUnit: 29.99 }
        ]
      },
      {
        id: 8,
        date: new Date('2024-01-22'),
        type: 'sale',
        total: 1299.99,
        paymentMethod: 'PayPal',
        status: 'completed',
        provider: 'PayPal',
        customerId: 3,
        customerInfo: 'Customer Gamma',
        employeeName: 'Piotr',
        items: [
          { productId: 1, productName: 'Laptop Pro 15', productCode: 'LAP-001', quantity: 1, pricePerUnit: 1299.99 }
        ]
      },
      {
        id: 9,
        date: new Date('2024-01-23'),
        type: 'sale',
        total: 499.98,
        paymentMethod: 'cash',
        status: 'completed',
        provider: 'In-Store',
        customerId: 4,
        customerInfo: 'Customer Delta',
        employeeName: 'Piotr',
        items: [
          { productId: 3, productName: 'Office Chair', productCode: 'CHR-003', quantity: 2, pricePerUnit: 249.99 }
        ]
      },
      {
        id: 10,
        date: new Date('2024-01-24'),
        type: 'sale',
        total: 359.92,
        paymentMethod: 'BLIK',
        status: 'new',
        provider: 'Payment Gateway',
        customerId: 5,
        customerInfo: 'Customer Epsilon',
        employeeName: 'Piotr',
        items: [
          { productId: 7, productName: 'Running Shoes', productCode: 'SHO-007', quantity: 4, pricePerUnit: 89.99 }
        ]
      }
    ];
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.png' : 'logo.png';
  }

  toggleRow(transaction: TransactionModel) {
    if (this.expandedRowIds.has(transaction.id)) {
      this.expandedRowIds.delete(transaction.id);
    } else {
      this.expandedRowIds.add(transaction.id);
    }
  }

  isRowExpanded(transaction: TransactionModel): boolean {
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
      employeeName: 'Piotr',
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

    const item: TransactionItemModel = {
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
      const index = this.transactions.findIndex(t => t.id === this.selectedTransactionId);
      if (index !== -1) {
        this.transactions[index] = {
          ...this.transactions[index],
          ...this.newTransaction
        } as TransactionModel;

        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Transaction updated successfully',
          life: 3000
        });
      }
    } else {
      const nextId = this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1;
      this.transactions = [...this.transactions, { ...this.newTransaction, id: nextId } as TransactionModel];

      this.messageService.add({
        severity: 'success',
        summary: 'Created',
        detail: `Transaction #${nextId} created successfully`,
        life: 3000
      });
    }
    this.submitted = false;
    this.displayDialog = false;
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
        this.transactions = this.transactions.filter(t => t.id !== this.selectedTransaction!.id);
        this.expandedRowIds.delete(this.selectedTransaction!.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Transaction deleted successfully',
          life: 3000
        });
        this.selectedTransaction = null;
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
    this.exportService.exportToExcel(this.transactions, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to Excel successfully',
      life: 2000
    });
  }

  exportToCSV() {
    this.exportService.exportToCSV(this.transactions, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to CSV successfully',
      life: 2000
    });
  }

  exportToJSON() {
    this.exportService.exportToJSON(this.transactions, 'customers');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to JSON successfully',
      life: 2000
    });
  }

  exportToHTML() {
    this.exportService.exportToHTML(this.transactions, 'customers', 'Customer List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to HTML successfully',
      life: 2000
    });
  }
}
