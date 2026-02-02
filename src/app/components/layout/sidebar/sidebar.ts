import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuModule } from 'primeng/menu';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ThemeService } from '../../../services/theme.service';
import { InfoDialogService } from '../../../services/info-dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuModule,
    AvatarModule,
    CardModule,
    ToastModule,
    DynamicDialogModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  @Output() menuItemClicked = new EventEmitter<void>();

  items: MenuItem[] | undefined;
  currentTime = new Date();
  username: string = 'User';
  loginTime: string = '';
  isDarkMode = false;
  isAnimating = false;
  isAnalyticsPage = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private themeService: ThemeService,
    private infoDialogService: InfoDialogService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername() || localStorage.getItem('username') || 'User';
    const loginTimeStr = localStorage.getItem('loginTime');
    if (loginTimeStr) {
      const date = new Date(loginTimeStr);
      this.loginTime = date.toLocaleTimeString();
    }

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.checkIfAnalyticsPage(this.router.url);
    this.buildMenu();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkIfAnalyticsPage(event.urlAfterRedirects);
    });
  }

  private checkIfAnalyticsPage(url: string): void {
    const wasAnalytics = this.isAnalyticsPage;
    this.isAnalyticsPage = url.includes('/analytics');

    if (wasAnalytics !== this.isAnalyticsPage) {
      this.buildMenu();
    }
  }

  private buildMenu(): void {
    this.items = [
      {
        label: 'Info About Author',
        icon: 'pi pi-id-card',
        command: () => {
          this.infoDialogService.showAuthorInfo();
          this.onMenuClick();
        }
      },
      {
        label: 'Info About App',
        icon: 'pi pi-info-circle',
        command: () => {
          this.infoDialogService.showAppInfo();
          this.onMenuClick();
        }
      },
      { separator: true },
      {
        label: 'Customer',
        icon: 'pi pi-users',
        routerLink: '/dashboard',
        command: () => this.onMenuClick()
      },
      {
        label: 'Product',
        icon: 'pi pi-box',
        routerLink: '/product',
        command: () => this.onMenuClick()
      },
      {
        label: 'Transaction',
        icon: 'pi pi-wallet',
        routerLink: '/transaction',
        command: () => this.onMenuClick()
      },
      {
        label: 'Delivery',
        icon: 'pi pi-truck',
        routerLink: '/delivery',
        command: () => this.onMenuClick()
      },
      { separator: true },
      {
        label: 'Chart & Analysis',
        icon: 'pi pi-chart-bar',
        routerLink: '/analytics',
        command: () => this.onMenuClick()
      },
      { separator: true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        styleClass: 'logout-menu-item',
        command: () => this.confirmLogout()
      }
    ];
  }

  onMenuClick(): void {
    this.menuItemClicked.emit();
  }

  toggleDarkMode(): void {
    this.isAnimating = true;
    this.themeService.toggleDarkMode();
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  confirmLogout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirm Logout',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Yes, logout',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.authService.logout();
      }
    });
  }
}
