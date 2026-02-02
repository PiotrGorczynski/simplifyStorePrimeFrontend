import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AnalyticsService, AnalyticsData } from '../services/analytics.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { fadeInOut } from '../../animations';
import { ThemeService } from '../services/theme.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    this.analyticsService.getSummary().subscribe({
      next: (summary) => {
        this.analyticsData = this.analyticsService.transformToAnalyticsData(summary);
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
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load analytics';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage || 'Unknown error',
          life: 3000
        });
      }
    });
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
            ticks: { color: colors.text },
            grid: { color: colors.grid }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Count', color: colors.text },
            ticks: { color: colors.text },
            grid: { color: colors.grid }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Revenue ($)', color: colors.text },
            ticks: { color: colors.text },
            grid: { drawOnChartArea: false }
          }
        },
        plugins: {
          legend: { labels: { color: colors.text } },
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
            labels: { color: colors.text }
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
            ticks: { color: colors.text },
            grid: { color: colors.grid }
          },
          y: {
            ticks: { color: colors.text },
            grid: { color: colors.grid }
          }
        },
        plugins: {
          legend: { display: false },
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

  exportToPDF(): void {
    if (!this.analyticsData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(22);
    doc.setTextColor(74, 20, 140);
    doc.text('Analytics Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Simplify Store Prime', pageWidth / 2, 28, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 35, { align: 'center' });

    doc.setDrawColor(124, 77, 255);
    doc.setLineWidth(0.5);
    doc.line(14, 40, pageWidth - 14, 40);

    doc.setFontSize(14);
    doc.setTextColor(74, 20, 140);
    doc.text('Summary Statistics', 14, 50);

    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: [
        ['Total Sales', `$${this.analyticsData.totalSales.toFixed(2)}`],
        ['Total Customers', this.analyticsData.totalCustomers.toString()],
        ['Total Products', this.analyticsData.totalProducts.toString()],
        ['Total Deliveries', this.analyticsData.totalDeliveries.toString()],
        ['Recent Transactions', this.analyticsData.recentTransactions.toString()]
      ],
      headStyles: { fillColor: [124, 77, 255], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      styles: { fontSize: 10 }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(74, 20, 140);
    doc.text('Payment Methods', 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Method', 'Count', 'Amount']],
      body: this.analyticsData.paymentMethods.map((pm: any) => [
        pm.method.charAt(0).toUpperCase() + pm.method.slice(1),
        pm.count.toString(),
        `$${pm.amount.toFixed(2)}`
      ]),
      headStyles: { fillColor: [124, 77, 255], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      styles: { fontSize: 10 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(74, 20, 140);
    doc.text('Transaction Status', 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Status', 'Count', 'Percentage']],
      body: this.analyticsData.transactionsByStatus.map((ts: any) => {
        const total = this.analyticsData!.transactionsByStatus.reduce((sum: number, item: any) => sum + item.count, 0);
        const percentage = ((ts.count / total) * 100).toFixed(1);
        return [
          ts.status.charAt(0).toUpperCase() + ts.status.slice(1),
          ts.count.toString(),
          `${percentage}%`
        ];
      }),
      headStyles: { fillColor: [124, 77, 255], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      styles: { fontSize: 10 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 220) { doc.addPage(); currentY = 20; }

    doc.setFontSize(14);
    doc.setTextColor(74, 20, 140);
    doc.text('Top Products by Revenue', 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['#', 'Product', 'Quantity Sold', 'Revenue']],
      body: this.analyticsData.topProducts.map((tp: any, index: number) => [
        (index + 1).toString(),
        tp.name,
        tp.quantity.toString(),
        `$${tp.revenue.toFixed(2)}`
      ]),
      headStyles: { fillColor: [124, 77, 255], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      styles: { fontSize: 10 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 220) { doc.addPage(); currentY = 20; }

    doc.setFontSize(14);
    doc.setTextColor(74, 20, 140);
    doc.text('Transactions by Date (Last 7 Days)', 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Date', 'Transactions', 'Revenue']],
      body: this.analyticsData.transactionsByDate.map((td: any) => [
        td.date,
        td.count.toString(),
        `$${td.amount.toFixed(2)}`
      ]),
      headStyles: { fillColor: [124, 77, 255], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      styles: { fontSize: 10 }
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Simplify Store Prime - Analytics Report - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);

    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Analytics report exported to PDF successfully',
      life: 2000
    });
  }

  exportToJSON(): void {
    if (!this.analyticsData) return;

    const exportData = {
      generatedAt: new Date().toISOString(),
      application: 'Simplify Store Prime',
      data: this.analyticsData
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'Analytics data exported to JSON successfully',
      life: 2000
    });
  }
}
