import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AnalyticsService, AnalyticsData } from '../services/analytics.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { fadeInOut } from '../../animations';
import { ThemeService } from '../services/theme.service';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
  animations: [fadeInOut],
  providers: [MessageService]
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('paymentMethodsChart') paymentMethodsChartRef!: ElementRef;
  @ViewChild('transactionsByDateChart') transactionsByDateChartRef!: ElementRef;
  @ViewChild('statusChart') statusChartRef!: ElementRef;
  @ViewChild('topProductsChart') topProductsChartRef!: ElementRef;

  analyticsData: AnalyticsData | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  isDarkMode = false;

  private paymentMethodsChart?: Chart;
  private transactionsByDateChart?: Chart;
  private statusChart?: Chart;
  private topProductsChart?: Chart;

  mockTransactions = [
    {
      id: 1, date: new Date('2024-01-15'), type: 'sale', total: 2749.93,
      paymentMethod: 'credit card', status: 'completed', provider: 'Stripe',
      customerId: 1, customerInfo: 'Customer Alpha', employeeName: 'Piotr',
      items: [
        { productId: 1, productName: 'Laptop Pro 15', productCode: 'LAP-001', quantity: 2, pricePerUnit: 1299.99 },
        { productId: 2, productName: 'Wireless Mouse', productCode: 'MSE-002', quantity: 5, pricePerUnit: 29.99 }
      ]
    },
    {
      id: 2, date: new Date('2024-01-16'), type: 'sale', total: 249.99,
      paymentMethod: 'cash', status: 'completed', provider: 'In-Store',
      customerId: 2, customerInfo: 'Customer Beta', employeeName: 'Piotr',
      items: [
        { productId: 3, productName: 'Office Chair', productCode: 'CHR-003', quantity: 1, pricePerUnit: 249.99 }
      ]
    },
    {
      id: 3, date: new Date('2024-01-17'), type: 'sale', total: 224.91,
      paymentMethod: 'BLIK', status: 'pending', provider: 'Payment Gateway',
      customerId: 3, customerInfo: 'Customer Gamma', employeeName: 'Piotr',
      items: [
        { productId: 4, productName: 'T-Shirt Cotton', productCode: 'TSH-004', quantity: 10, pricePerUnit: 19.99 },
        { productId: 5, productName: 'Notebook A4', productCode: 'NTB-005', quantity: 5, pricePerUnit: 4.99 }
      ]
    },
    {
      id: 4, date: new Date('2024-01-18'), type: 'sale', total: 79.99,
      paymentMethod: 'debit card', status: 'completed', provider: 'Square',
      customerId: 4, customerInfo: 'Customer Delta', employeeName: 'Piotr',
      items: [
        { productId: 6, productName: 'Coffee Maker', productCode: 'COF-006', quantity: 1, pricePerUnit: 79.99 }
      ]
    },
    {
      id: 5, date: new Date('2024-01-19'), type: 'sale', total: 539.88,
      paymentMethod: 'credit card', status: 'in transit', provider: 'PayPal',
      customerId: 5, customerInfo: 'Customer Epsilon', employeeName: 'Piotr',
      items: [
        { productId: 7, productName: 'Running Shoes', productCode: 'SHO-007', quantity: 4, pricePerUnit: 89.99 },
        { productId: 8, productName: 'Screwdriver Set', productCode: 'TOL-008', quantity: 6, pricePerUnit: 24.99 }
      ]
    },
    {
      id: 6, date: new Date('2024-01-20'), type: 'return', total: -1299.99,
      paymentMethod: 'credit card', status: 'completed', provider: 'Refund',
      customerId: 1, customerInfo: 'Customer Alpha', employeeName: 'Piotr',
      items: [
        { productId: 1, productName: 'Laptop Pro 15', productCode: 'LAP-001', quantity: 1, pricePerUnit: 1299.99 }
      ]
    },
    {
      id: 7, date: new Date('2024-01-21'), type: 'sale', total: 149.95,
      paymentMethod: 'bank transfer', status: 'pending', provider: 'Wire Transfer',
      customerId: 2, customerInfo: 'Customer Beta', employeeName: 'Piotr',
      items: [
        { productId: 2, productName: 'Wireless Mouse', productCode: 'MSE-002', quantity: 5, pricePerUnit: 29.99 }
      ]
    },
    {
      id: 8, date: new Date('2024-01-22'), type: 'sale', total: 1299.99,
      paymentMethod: 'PayPal', status: 'completed', provider: 'PayPal',
      customerId: 3, customerInfo: 'Customer Gamma', employeeName: 'Piotr',
      items: [
        { productId: 1, productName: 'Laptop Pro 15', productCode: 'LAP-001', quantity: 1, pricePerUnit: 1299.99 }
      ]
    },
    {
      id: 9, date: new Date('2024-01-23'), type: 'sale', total: 499.98,
      paymentMethod: 'cash', status: 'completed', provider: 'In-Store',
      customerId: 4, customerInfo: 'Customer Delta', employeeName: 'Piotr',
      items: [
        { productId: 3, productName: 'Office Chair', productCode: 'CHR-003', quantity: 2, pricePerUnit: 249.99 }
      ]
    },
    {
      id: 10, date: new Date('2024-01-24'), type: 'sale', total: 359.92,
      paymentMethod: 'BLIK', status: 'new', provider: 'Payment Gateway',
      customerId: 5, customerInfo: 'Customer Epsilon', employeeName: 'Piotr',
      items: [
        { productId: 7, productName: 'Running Shoes', productCode: 'SHO-007', quantity: 4, pricePerUnit: 89.99 }
      ]
    }
  ];

  mockCustomers = Array(20).fill(null).map((_, i) => ({ id: i + 1 }));
  mockProducts = Array(20).fill(null).map((_, i) => ({ id: i + 1 }));
  mockDeliveries = Array(20).fill(null).map((_, i) => ({ id: i + 1 }));

  constructor(
    private analyticsService: AnalyticsService,
    private messageService: MessageService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      if (this.analyticsData) {
        setTimeout(() => this.createCharts(), 100);
      }
    });

    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;
    this.errorMessage = null;

    setTimeout(() => {
      try {
        if (this.mockTransactions.length === 0) {
          throw new Error('No transactions available for analytics');
        }

        this.analyticsData = this.analyticsService.generateAnalytics(
          this.mockTransactions,
          this.mockCustomers,
          this.mockProducts,
          this.mockDeliveries
        );

        this.isLoading = false;

        setTimeout(() => {
          this.createCharts();
        }, 100);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Analytics data loaded successfully',
          life: 2000
        });

      } catch (error: any) {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load analytics';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Error",
          life: 3000
        });
      }
    }, 800);
  }

  private getChartColors() {
    return {
      text: this.isDarkMode ? '#e8e8e8' : '#666',
      title: this.isDarkMode ? '#e8e8e8' : '#4a148c',
      grid: this.isDarkMode ? '#3e3e42' : '#e0e0e0'
    };
  }

  createCharts(): void {
    if (!this.analyticsData) return;

    this.createPaymentMethodsChart();
    this.createTransactionsByDateChart();
    this.createStatusChart();
    this.createTopProductsChart();
  }

  createPaymentMethodsChart(): void {
    if (!this.paymentMethodsChartRef) return;

    const canvas = this.paymentMethodsChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (this.paymentMethodsChart) {
      this.paymentMethodsChart.destroy();
    }

    const data = this.analyticsData!.paymentMethods;
    const labels = data.map((d: any) => d.method);
    const values = data.map((d: any) => d.count);
    const amounts = data.map((d: any) => d.amount);
    const colors = this.getChartColors();

    this.paymentMethodsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#7c4dff',
            '#4a148c',
            '#b39ddb',
            '#9575cd',
            '#673ab7',
            '#5e35b1',
            '#512da8'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.text
            }
          },
          title: {
            display: true,
            text: 'Payment Methods Distribution',
            font: { size: 16, weight: 'bold' },
            color: colors.title
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const amount = amounts[context.dataIndex];
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return [
                  `${label}: ${value} transactions (${percentage}%)`,
                  `Revenue: $${amount.toFixed(2)}`
                ];
              }
            }
          }
        }
      }
    });
  }

  createTransactionsByDateChart(): void {
    if (!this.transactionsByDateChartRef) return;

    const canvas = this.transactionsByDateChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (this.transactionsByDateChart) {
      this.transactionsByDateChart.destroy();
    }

    const data = this.analyticsData!.transactionsByDate;
    const labels = data.map((d: any) => d.date);
    const counts = data.map((d: any) => d.count);
    const amounts = data.map((d: any) => d.amount);
    const colors = this.getChartColors();

    this.transactionsByDateChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Transaction Count',
            data: counts,
            backgroundColor: '#7c4dff',
            yAxisID: 'y'
          },
          {
            label: 'Revenue ($)',
            data: amounts,
            backgroundColor: '#4a148c',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            ticks: {
              color: colors.text
            },
            grid: {
              color: colors.grid
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Count',
              color: colors.text
            },
            ticks: {
              color: colors.text
            },
            grid: {
              color: colors.grid
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Revenue ($)',
              color: colors.text
            },
            ticks: {
              color: colors.text
            },
            grid: {
              drawOnChartArea: false
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: colors.text
            }
          },
          title: {
            display: true,
            text: 'Transactions Over Time (Last 7 Days)',
            font: { size: 16, weight: 'bold' },
            color: colors.title
          }
        }
      }
    });
  }

  createStatusChart(): void {
    if (!this.statusChartRef) return;

    const canvas = this.statusChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const data = this.analyticsData!.transactionsByStatus;
    const labels = data.map((d: any) => d.status);
    const values = data.map((d: any) => d.count);
    const colors = this.getChartColors();

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#4caf50',
            '#2196f3',
            '#ff9800',
            '#f44336',
            '#9e9e9e'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.text
            }
          },
          title: {
            display: true,
            text: 'Transaction Status',
            font: { size: 16, weight: 'bold' },
            color: colors.title
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  createTopProductsChart(): void {
    if (!this.topProductsChartRef) return;

    const canvas = this.topProductsChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (this.topProductsChart) {
      this.topProductsChart.destroy();
    }

    const data = this.analyticsData!.topProducts;
    const labels = data.map((d: any) => d.name);
    const revenues = data.map((d: any) => d.revenue);
    const colors = this.getChartColors();

    this.topProductsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue ($)',
          data: revenues,
          backgroundColor: '#7c4dff'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: colors.text
            },
            grid: {
              color: colors.grid
            }
          },
          y: {
            ticks: {
              color: colors.text
            },
            grid: {
              color: colors.grid
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top 5 Products by Revenue',
            font: { size: 16, weight: 'bold' },
            color: colors.title
          }
        }
      }
    });
  }

  refreshData(): void {
    this.loadAnalytics();
  }
}
