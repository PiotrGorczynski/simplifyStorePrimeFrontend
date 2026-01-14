import { Injectable } from '@angular/core';

export interface AnalyticsData {
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  totalDeliveries: number;
  recentTransactions: number;
  paymentMethods: { method: string; count: number; amount: number }[];
  transactionsByDate: { date: string; count: number; amount: number }[];
  transactionsByStatus: { status: string; count: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  generateAnalytics(
    transactions: any[],
    customers: any[],
    products: any[],
    deliveries: any[]
  ): AnalyticsData {

    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);

    const paymentMethodsMap = new Map<string, { count: number; amount: number }>();
    transactions.forEach(t => {
      const method = t.paymentMethod || 'unknown';
      const existing = paymentMethodsMap.get(method) || { count: 0, amount: 0 };
      paymentMethodsMap.set(method, {
        count: existing.count + 1,
        amount: existing.amount + t.total
      });
    });

    const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount
    }));

    const last7Days = this.getLast7Days();
    const transactionsByDateMap = new Map<string, { count: number; amount: number }>();

    last7Days.forEach(date => {
      transactionsByDateMap.set(date, { count: 0, amount: 0 });
    });

    transactions.forEach(t => {
      const dateStr = new Date(t.date).toLocaleDateString('en-GB');
      const existing = transactionsByDateMap.get(dateStr);
      if (existing) {
        transactionsByDateMap.set(dateStr, {
          count: existing.count + 1,
          amount: existing.amount + t.total
        });
      }
    });

    const transactionsByDate = Array.from(transactionsByDateMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      amount: data.amount
    }));

    const statusMap = new Map<string, number>();
    transactions.forEach(t => {
      const status = t.status || 'unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    const transactionsByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count
    }));

    const productMap = new Map<string, { quantity: number; revenue: number }>();
    transactions.forEach(t => {
      if (t.items && Array.isArray(t.items)) {
        t.items.forEach((item: any) => {
          const existing = productMap.get(item.productName) || { quantity: 0, revenue: 0 };
          productMap.set(item.productName, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.quantity * item.pricePerUnit)
          });
        });
      }
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalSales,
      totalCustomers: customers.length,
      totalProducts: products.length,
      totalDeliveries: deliveries.length,
      recentTransactions: transactions.length,
      paymentMethods,
      transactionsByDate,
      transactionsByStatus,
      topProducts
    };
  }

  private getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-GB'));
    }
    return days;
  }
}
