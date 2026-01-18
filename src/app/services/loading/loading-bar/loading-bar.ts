import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-bar.html',
  styleUrl: './loading-bar.scss'
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  @Input() showOverlay = false;

  isLoading = false;
  private subscription!: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(
      loading => this.isLoading = loading
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
