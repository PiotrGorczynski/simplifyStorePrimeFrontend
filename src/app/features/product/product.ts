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

export interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  notes: string;
  minQuantity: number;
  another: string;
}

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
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedProductId: number | null = null;
  selectedProduct: Product | null = null;

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
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.products = [
      {
        id: 1,
        name: 'Laptop Pro 15',
        code: 'LAP-001',
        category: 'electronics',
        price: 1299.99,
        stock: 45,
        description: 'High-performance laptop with 16GB RAM',
        notes: 'Popular item',
        minQuantity: 1,
        another: 'Warranty: 2 years'
      },
      {
        id: 2,
        name: 'Wireless Mouse',
        code: 'MSE-002',
        category: 'electronics',
        price: 29.99,
        stock: 150,
        description: 'Ergonomic wireless mouse with USB receiver',
        notes: 'Best seller',
        minQuantity: 5,
        another: 'Battery included'
      },
      {
        id: 3,
        name: 'Office Chair',
        code: 'CHR-003',
        category: 'furniture',
        price: 249.99,
        stock: 30,
        description: 'Comfortable ergonomic office chair',
        notes: 'Premium quality',
        minQuantity: 1,
        another: 'Adjustable height'
      },
      {
        id: 4,
        name: 'T-Shirt Cotton',
        code: 'TSH-004',
        category: 'clothing',
        price: 19.99,
        stock: 200,
        description: '100% cotton t-shirt, various sizes',
        notes: 'Summer collection',
        minQuantity: 10,
        another: 'Multiple colors'
      },
      {
        id: 5,
        name: 'Notebook A4',
        code: 'NTB-005',
        category: 'books',
        price: 4.99,
        stock: 500,
        description: '200 pages ruled notebook',
        notes: 'School supply',
        minQuantity: 20,
        another: 'Eco-friendly paper'
      },
      {
        id: 6,
        name: 'Coffee Maker',
        code: 'COF-006',
        category: 'electronics',
        price: 79.99,
        stock: 60,
        description: 'Automatic drip coffee maker',
        notes: 'Kitchen essential',
        minQuantity: 2,
        another: '12-cup capacity'
      },
      {
        id: 7,
        name: 'Running Shoes',
        code: 'SHO-007',
        category: 'sports',
        price: 89.99,
        stock: 80,
        description: 'Professional running shoes',
        notes: 'Top rated',
        minQuantity: 5,
        another: 'Breathable material'
      },
      {
        id: 8,
        name: 'Screwdriver Set',
        code: 'TOL-008',
        category: 'tools',
        price: 24.99,
        stock: 100,
        description: '20-piece screwdriver set with case',
        notes: 'Professional grade',
        minQuantity: 3,
        another: 'Magnetic tips'
      },
      {
        id: 9,
        name: 'Building Blocks',
        code: 'TOY-009',
        category: 'toys',
        price: 34.99,
        stock: 120,
        description: '500-piece building blocks set',
        notes: 'Ages 4+',
        minQuantity: 5,
        another: 'Educational toy'
      },
      {
        id: 10,
        name: 'Desk Lamp LED',
        code: 'LMP-010',
        category: 'electronics',
        price: 39.99,
        stock: 75,
        description: 'Adjustable LED desk lamp',
        notes: 'Energy efficient',
        minQuantity: 2,
        another: 'Touch control'
      },
      {
        id: 11,
        name: 'Backpack Travel',
        code: 'BAG-011',
        category: 'clothing',
        price: 59.99,
        stock: 90,
        description: 'Durable travel backpack 40L',
        notes: 'Water resistant',
        minQuantity: 3,
        another: 'Multiple compartments'
      },
      {
        id: 12,
        name: 'Protein Powder',
        code: 'FOD-012',
        category: 'food',
        price: 49.99,
        stock: 110,
        description: 'Whey protein powder 2kg',
        notes: 'Vanilla flavor',
        minQuantity: 5,
        another: 'High quality'
      },
      {
        id: 13,
        name: 'Yoga Mat',
        code: 'SPT-013',
        category: 'sports',
        price: 29.99,
        stock: 140,
        description: 'Non-slip yoga mat with bag',
        notes: 'Eco-friendly',
        minQuantity: 5,
        another: '6mm thickness'
      },
      {
        id: 14,
        name: 'Hammer Tool',
        code: 'TOL-014',
        category: 'tools',
        price: 19.99,
        stock: 85,
        description: 'Claw hammer with rubber grip',
        notes: 'Heavy duty',
        minQuantity: 3,
        another: 'Steel construction'
      },
      {
        id: 15,
        name: 'Board Game Classic',
        code: 'TOY-015',
        category: 'toys',
        price: 24.99,
        stock: 95,
        description: 'Classic family board game',
        notes: 'Ages 8+',
        minQuantity: 3,
        another: '2-6 players'
      },
      {
        id: 16,
        name: 'Cookbook Italian',
        code: 'BOK-016',
        category: 'books',
        price: 29.99,
        stock: 70,
        description: 'Italian cuisine cookbook',
        notes: 'Bestseller',
        minQuantity: 2,
        another: '200 recipes'
      },
      {
        id: 17,
        name: 'Bookshelf Wood',
        code: 'FUR-017',
        category: 'furniture',
        price: 149.99,
        stock: 25,
        description: '5-tier wooden bookshelf',
        notes: 'Assembly required',
        minQuantity: 1,
        another: 'Oak finish'
      },
      {
        id: 18,
        name: 'Headphones Wireless',
        code: 'AUD-018',
        category: 'electronics',
        price: 129.99,
        stock: 65,
        description: 'Noise-cancelling wireless headphones',
        notes: 'Premium sound',
        minQuantity: 2,
        another: '30h battery life'
      },
      {
        id: 19,
        name: 'Water Bottle Steel',
        code: 'SPT-019',
        category: 'sports',
        price: 24.99,
        stock: 180,
        description: 'Insulated stainless steel bottle 1L',
        notes: 'Keeps cold 24h',
        minQuantity: 10,
        another: 'BPA-free'
      },
      {
        id: 20,
        name: 'Jeans Denim',
        code: 'CLO-020',
        category: 'clothing',
        price: 69.99,
        stock: 130,
        description: 'Classic fit denim jeans',
        notes: 'All sizes available',
        minQuantity: 5,
        another: 'Stretch fabric'
      }
    ];
  }

  showDialog() {
    this.isEditMode = false;
    this.selectedProductId = null;
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
      const index = this.products.findIndex(p => p.id === this.selectedProductId);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...this.newProduct
        } as Product;

        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Product updated successfully',
          life: 3000
        });
      }
    } else {
      const nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      this.products = [...this.products, { ...this.newProduct, id: nextId } as Product];

      this.messageService.add({
        severity: 'success',
        summary: 'Created',
        detail: `Product ${this.newProduct.name} added successfully`,
        life: 3000
      });
    }

    this.displayDialog = false;
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
        this.products = this.products.filter(p => p.id !== this.selectedProduct!.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Product deleted successfully',
          life: 3000
        });
        this.selectedProduct = null;
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

  onLogout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Logout Confirmation',
      icon: 'pi pi-sign-out',
      accept: () => {
        console.log('Logging out...');
        this.router.navigate(['/login']);
      }
    });
  }
}
