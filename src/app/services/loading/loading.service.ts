import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  private isLoading$ = new BehaviorSubject<boolean>(false);

  readonly loading$ = this.isLoading$.asObservable();

  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.isLoading$.next(true);
    }
  }

  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.isLoading$.next(false);
    }
  }

  reset(): void {
    this.loadingCount = 0;
    this.isLoading$.next(false);
  }
}
