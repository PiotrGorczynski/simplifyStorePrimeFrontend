import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface TransactionItem {
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

  getAll(): Observable<Transaction[]> {
    this.setLoading(true);
    return this.http.get<Transaction[]>(this.apiUrl).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  getById(id: number): Observable<Transaction> {
    this.setLoading(true);
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  create(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    this.setLoading(true);
    return this.http.post<Transaction>(this.apiUrl, transaction).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  update(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    this.setLoading(true);
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction).pipe(
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
