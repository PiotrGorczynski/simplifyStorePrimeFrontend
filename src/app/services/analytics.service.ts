import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface ProductRevenue {
  productName: string;
  revenue: number;
}

export interface DailyTransaction {
  date: string;
  count: number;
  revenue: number;
}

export interface AnalyticsSummary {
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  totalDeliveries: number;
  paymentMethodsDistribution: { [key: string]: number };
  transactionStatusDistribution: { [key: string]: number };
  topProducts: ProductRevenue[];
  dailyTransactions: DailyTransaction[];
  deliveryTypeDistribution: { [key: string]: number };
}

export interface AnalyticsData {
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  totalDeliveries: number;
  recentTransactions: number;
  paymentMethods: { method: string; count: number; amount: number }[];
  transactionsByStatus: { status: string; count: number }[];
  transactionsByDate: { date: string; count: number; amount: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  deliveryTypes: { type: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.apiUrl}/summary`);
  }

  transformToAnalyticsData(summary: AnalyticsSummary): AnalyticsData {
    const paymentMethods = Object.entries(summary.paymentMethodsDistribution || {}).map(([method, count]) => ({
      method,
      count: count as number,
      amount: 0
    }));

    const transactionsByStatus = Object.entries(summary.transactionStatusDistribution || {}).map(([status, count]) => ({
      status,
      count: count as number
    }));

    const transactionsByDate = (summary.dailyTransactions || []).map(dt => ({
      date: dt.date,
      count: dt.count,
      amount: dt.revenue
    }));

    const topProducts = (summary.topProducts || []).map(tp => ({
      name: tp.productName,
      quantity: 0,
      revenue: tp.revenue
    }));

    const deliveryTypes = Object.entries(summary.deliveryTypeDistribution || {})
      .map(([type, count]) => ({ type, count: count as number }));

    return {
      totalSales: summary.totalSales || 0,
      totalCustomers: summary.totalCustomers || 0,
      totalProducts: summary.totalProducts || 0,
      totalDeliveries: summary.totalDeliveries || 0,
      recentTransactions: transactionsByDate.reduce((sum, d) => sum + d.count, 0),
      paymentMethods,
      transactionsByStatus,
      transactionsByDate,
      topProducts,
      deliveryTypes
    };
  }

  generateAnalytics(transactions: any[], customers: any[], products: any[], deliveries: any[]): AnalyticsData {
    return {
      totalSales: 0,
      totalCustomers: 0,
      totalProducts: 0,
      totalDeliveries: 0,
      recentTransactions: 0,
      paymentMethods: [],
      transactionsByStatus: [],
      transactionsByDate: [],
      topProducts: [],
      deliveryTypes: []
    };
  }
}
