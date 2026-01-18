import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { InfoDialogService } from '../../../services/info-dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';


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
    ToggleSwitchModule,
    FormsModule,
    DynamicDialogModule,
    TooltipModule
  ],
  providers: [MessageService],
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

  constructor(
    private router: Router,
    private messageService: MessageService,
    private themeService: ThemeService,
    private infoDialogService: InfoDialogService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'User';
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
}
