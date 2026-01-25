import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Customer {
  id: number;
  info: string;
  salesOrders: string;
  invoices: string;
  paymentHistory: string;
  communication: string;
  category: string;
  feedback: string;
  notes: string;
  supportRequest: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getAll(): Observable<Customer[]> {
    this.setLoading(true);
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  getById(id: number): Observable<Customer> {
    this.setLoading(true);
    return this.http.get<Customer>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  create(customer: Omit<Customer, 'id'>): Observable<Customer> {
    this.setLoading(true);
    return this.http.post<Customer>(this.apiUrl, customer).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  update(id: number, customer: Partial<Customer>): Observable<Customer> {
    this.setLoading(true);
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer).pipe(
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
