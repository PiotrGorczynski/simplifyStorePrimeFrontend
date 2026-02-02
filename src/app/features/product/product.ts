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
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product',
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
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class ProductComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;
  products: Product[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedProductId: number | null = null;
  selectedProduct: Product | null = null;
  isDarkMode = false;
  submitted: boolean = false;
  searchValue: string = '';
  isLoading = false;

  private actionSubscription: Subscription | null = null;
  private loadingSubscription: Subscription | null = null;

  newProduct: Partial<Product> = {
    name: '',
    code: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    notes: '',
    minQuantity: 1,
    another: ''
  };

  categoryOptions = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Food', value: 'food' },
    { label: 'Books', value: 'books' },
    { label: 'Furniture', value: 'furniture' },
    { label: 'Tools', value: 'tools' },
    { label: 'Toys', value: 'toys' },
    { label: 'Sports', value: 'sports' }
  ];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private exportService: ExportService,
    private themeService: ThemeService,
    private actionService: ActionService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.productService.loading$.subscribe(
      loading => this.isLoading = loading
    );

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

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load products',
          life: 5000
        });
        this.products = [];
      }
    });
  }

  private handleAction(action: ActionType): void {
    switch (action) {
      case 'show':
        this.onShowProduct();
        break;
      case 'insert':
        this.showDialog();
        break;
      case 'update':
        this.showUpdateDialog();
        break;
      case 'delete':
        this.deleteProduct();
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
    this.selectedProductId = null;
    this.submitted = false;
    this.newProduct = {
      name: '',
      code: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      notes: '',
      minQuantity: 1,
      another: ''
    };
    this.displayDialog = true;
  }

  showUpdateDialog() {
    if (!this.selectedProduct) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a product first',
        life: 3000
      });
      return;
    }

    this.isEditMode = true;
    this.submitted = false;
    this.selectedProductId = this.selectedProduct.id;
    this.newProduct = {
      name: this.selectedProduct.name,
      code: this.selectedProduct.code,
      category: this.selectedProduct.category,
      price: this.selectedProduct.price,
      stock: this.selectedProduct.stock,
      description: this.selectedProduct.description,
      notes: this.selectedProduct.notes,
      minQuantity: this.selectedProduct.minQuantity,
      another: this.selectedProduct.another
    };
    this.displayDialog = true;
  }

  saveProduct() {
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

    if (this.isEditMode && this.selectedProductId) {
      this.productService.update(this.selectedProductId, this.newProduct).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.id === this.selectedProductId);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.products = [...this.products];
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Product updated successfully',
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update product',
            life: 5000
          });
        }
      });
    } else {
      this.productService.create(this.newProduct as Omit<Product, 'id'>).subscribe({
        next: (createdProduct) => {
          this.products = [...this.products, createdProduct];
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `Product ${createdProduct.name} added successfully`,
            life: 3000
          });
          this.submitted = false;
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to create product',
            life: 5000
          });
        }
      });
    }
  }

  deleteProduct() {
    if (!this.selectedProduct) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a product first',
        life: 3000
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedProduct.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productService.delete(this.selectedProduct!.id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== this.selectedProduct!.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Product deleted successfully',
              life: 3000
            });
            this.selectedProduct = null;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete product',
              life: 5000
            });
          }
        });
      }
    });
  }

  onShowProduct() {
    if (!this.selectedProduct) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a product first',
        life: 3000
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Product Details',
      detail: `${this.selectedProduct.name} (${this.selectedProduct.code}) - $${this.selectedProduct.price}`,
      life: 3000
    });
  }

  closeDialog() {
    this.submitted = false;
    this.displayDialog = false;
  }

  isFormValid(): boolean {
    return !!(
      this.newProduct.name &&
      this.newProduct.name.trim() !== '' &&
      this.newProduct.code &&
      this.newProduct.code.trim() !== '' &&
      this.newProduct.category &&
      this.newProduct.price !== undefined &&
      this.newProduct.price > 0 &&
      this.newProduct.stock !== undefined &&
      this.newProduct.stock >= 0
    );
  }

  getDialogHeader(): string {
    return this.isEditMode ? 'Update Product Entry' : 'Add New Product Entry';
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
    this.exportService.exportToPDF(this.products, 'products', 'Product List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to PDF successfully',
      life: 2000
    });
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.products, 'products');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to Excel successfully',
      life: 2000
    });
  }

  exportToCSV() {
    this.exportService.exportToCSV(this.products, 'products');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to CSV successfully',
      life: 2000
    });
  }

  exportToJSON() {
    this.exportService.exportToJSON(this.products, 'products');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to JSON successfully',
      life: 2000
    });
  }

  exportToHTML() {
    this.exportService.exportToHTML(this.products, 'products', 'Product List');
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Data exported to HTML successfully',
      life: 2000
    });
  }
}
