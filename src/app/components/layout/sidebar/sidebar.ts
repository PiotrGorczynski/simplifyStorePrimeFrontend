import {Component, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule, AvatarModule, CardModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;
  currentTime = new Date();
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => { this.currentTime = new Date(); }, 1000);
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
        icon: 'pi pi-chart-bar'
      }
    ];
  }
}
