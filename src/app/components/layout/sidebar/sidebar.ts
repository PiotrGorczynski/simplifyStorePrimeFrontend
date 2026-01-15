import {Component, OnInit } from '@angular/core';
import {Router, RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule, AvatarModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;
  currentTime = new Date();
  constructor(private router: Router, private messageService: MessageService) {}
  username: string = 'User';
  loginTime: string = '';

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'User';
    const loginTimeStr = localStorage.getItem('loginTime');
    if (loginTimeStr) {
      const date = new Date(loginTimeStr);
      this.loginTime = date.toLocaleTimeString();
    }
    this.items = [
      {
        label: 'Info About Author',
        icon: 'pi pi-id-card',
        command: () => console.log('Info kliknięte')
      },
      {
        label: 'Info About App',
        icon: 'pi pi-info-circle'
      },
      { separator: true },
      {
        label: 'Customer',
        icon: 'pi pi-users',
        routerLink: '/dashboard'
      },
      {
        label: 'Product',
        icon: 'pi pi-box',
        routerLink: '/product'
      },
      {
        label: 'Transaction',
        icon: 'pi pi-wallet',
        routerLink: '/transaction'
      },
      {
        label: 'Delivery',
        icon: 'pi pi-truck',
        routerLink: '/delivery'
      },
      { separator: true },
      {
        label: 'Chart & Analysis',
        icon: 'pi pi-chart-bar',
        routerLink: '/analytics'
      }
    ];
  }
}
