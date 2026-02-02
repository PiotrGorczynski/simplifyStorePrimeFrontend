import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface TransactionItem {
  id?: number;
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Transaction {
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
  items: TransactionItem[];
}

interface TransactionBackend {
  id: number;
  date: string;
  type: string;
  total: number;
  paymentMethod: string;
  status: string;
  provider: string;
  customerId: number;
  customerInfo: string;
  employeeName: string;
  items: TransactionItem[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private mapFromBackend(t: TransactionBackend): Transaction {
    return {
      ...t,
      date: new Date(t.date)
    };
  }

  private mapToBackend(t: Partial<Transaction>): any {
    const result: any = { ...t };
    if (t.date) {
      result.date = t.date instanceof Date
        ? t.date.toISOString().split('T')[0]
        : t.date;
    }
    return result;
  }

  getAll(): Observable<Transaction[]> {
    this.setLoading(true);
    return this.http.get<TransactionBackend[]>(this.apiUrl).pipe(
      map(transactions => transactions.map(t => this.mapFromBackend(t))),
      finalize(() => this.setLoading(false))
    );
  }

  getById(id: number): Observable<Transaction> {
    this.setLoading(true);
    return this.http.get<TransactionBackend>(`${this.apiUrl}/${id}`).pipe(
      map(t => this.mapFromBackend(t)),
      finalize(() => this.setLoading(false))
    );
  }

  create(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    this.setLoading(true);
    const payload = this.mapToBackend(transaction);
    return this.http.post<TransactionBackend>(this.apiUrl, payload).pipe(
      map(t => this.mapFromBackend(t)),
      finalize(() => this.setLoading(false))
    );
  }

  update(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    this.setLoading(true);
    const payload = this.mapToBackend(transaction);
    return this.http.put<TransactionBackend>(`${this.apiUrl}/${id}`, payload).pipe(
      map(t => this.mapFromBackend(t)),
      finalize(() => this.setLoading(false))
    );
  }

  delete(id: number): Observable<void> {
    this.setLoading(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.setLoading(false))
    );
  }
}
