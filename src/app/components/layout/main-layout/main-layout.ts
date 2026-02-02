import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../sidebar/sidebar';
import { ThemeService } from '../../../services/theme.service';
import { ActionService } from '../../../services/action.service';
import { ToastModule } from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import { filter } from 'rxjs/operators';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, ButtonModule, ToastModule, ConfirmDialogModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  providers: [MessageService, ConfirmationService]
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = false;
  actionPanelVisible = false;
  isDarkMode = false;
  isMobile = false;
  private isActionPanelDisabled = false;

  private touchStartX = 0;
  private touchStartY = 0;
  private minSwipeDistance = 50;

  private actionPanelDisabledRoutes = ['/analytics'];

  constructor(
    private themeService: ThemeService,
    private actionService: ActionService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.checkRouteForActionPanel(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRouteForActionPanel(event.urlAfterRedirects);
    });
  }

  private checkRouteForActionPanel(url: string): void {
    this.isActionPanelDisabled = this.actionPanelDisabledRoutes.some(route => url.startsWith(route));
    if (this.isActionPanelDisabled) {
      this.actionPanelVisible = false;
    }
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
      } else if (!this.isActionPanelDisabled) {
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
    if (this.isActionPanelDisabled) return;
    this.actionPanelVisible = !this.actionPanelVisible;
    if (this.actionPanelVisible) {
      this.sidebarVisible = false;
    }
  }

  openActionPanel(): void {
    if (this.isActionPanelDisabled) return;
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

    if (action === 'logout') {
      this.onLogout();
      return;
    }

    this.actionService.emitAction(action);
    this.closeActionPanel();
  }

  onLogout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirm Logout',
      icon: 'pi pi-sign-out',
      accept: () => {
        this.authService.logout();
      }
    });
  }

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.png' : 'logo.png';
  }
}
