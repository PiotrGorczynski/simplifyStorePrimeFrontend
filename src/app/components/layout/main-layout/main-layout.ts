import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../sidebar/sidebar';
import { ThemeService } from '../../../services/theme.service';
import { ActionService } from '../../../services/action.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, ButtonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = false;
  actionPanelVisible = false;
  isDarkMode = false;
  isMobile = false;

  private touchStartX = 0;
  private touchStartY = 0;
  private minSwipeDistance = 50;

  constructor(
    private themeService: ThemeService,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      this.sidebarVisible = false;
      this.actionPanelVisible = false;
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isMobile) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
      if (deltaX > 0) {
        this.openSidebar();
      } else {
        this.openActionPanel();
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    if (this.sidebarVisible) {
      this.actionPanelVisible = false;
    }
  }

  openSidebar(): void {
    this.sidebarVisible = true;
    this.actionPanelVisible = false;
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.sidebarVisible = false;
    }
  }

  toggleActionPanel(): void {
    this.actionPanelVisible = !this.actionPanelVisible;
    if (this.actionPanelVisible) {
      this.sidebarVisible = false;
    }
  }

  openActionPanel(): void {
    this.actionPanelVisible = true;
    this.sidebarVisible = false;
  }

  closeActionPanel(): void {
    if (this.isMobile) {
      this.actionPanelVisible = false;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  emitAction(action: string): void {
    console.log('Emitting action:', action);
    this.actionService.emitAction(action);
    this.closeActionPanel();
  }

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.png' : 'logo.png';
  }
}
