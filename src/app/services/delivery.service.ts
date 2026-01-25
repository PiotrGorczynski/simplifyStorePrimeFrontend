import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Delivery {
  id: number;
  deliveryType: string;
  status: string;
  provider: string;
  transactionId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/deliveries`;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getAll(): Observable<Delivery[]> {
    this.setLoading(true);
    return this.http.get<Delivery[]>(this.apiUrl).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  getById(id: number): Observable<Delivery> {
    this.setLoading(true);
    return this.http.get<Delivery>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  create(delivery: Omit<Delivery, 'id'>): Observable<Delivery> {
    this.setLoading(true);
    return this.http.post<Delivery>(this.apiUrl, delivery).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  update(id: number, delivery: Partial<Delivery>): Observable<Delivery> {
    this.setLoading(true);
    return this.http.put<Delivery>(`${this.apiUrl}/${id}`, delivery).pipe(
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
