import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getAll(): Observable<Product[]> {
    this.setLoading(true);
    return this.http.get<Product[]>(this.apiUrl).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  getById(id: number): Observable<Product> {
    this.setLoading(true);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    this.setLoading(true);
    return this.http.post<Product>(this.apiUrl, product).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    this.setLoading(true);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
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
