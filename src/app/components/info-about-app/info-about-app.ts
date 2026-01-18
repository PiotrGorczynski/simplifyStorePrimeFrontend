import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface TechItem {
  name: string;
  category: string;
}

@Component({
  selector: 'app-info-about-app',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './info-about-app.html',
  styleUrl: './info-about-app.scss',
  encapsulation: ViewEncapsulation.None
})
export class InfoAboutAppComponent {

  appVersion = '1.0.0';

  features: Feature[] = [
    { icon: 'pi pi-users', title: 'Customer Management', desc: 'Full CRUD operations for customers' },
    { icon: 'pi pi-box', title: 'Product Catalog', desc: 'Manage your product inventory' },
    { icon: 'pi pi-wallet', title: 'Transactions', desc: 'Track all financial transactions' },
    { icon: 'pi pi-truck', title: 'Deliveries', desc: 'Monitor delivery status' },
    { icon: 'pi pi-chart-bar', title: 'Analytics', desc: 'Visual data analysis & charts' },
    { icon: 'pi pi-file-export', title: 'Export', desc: 'Export data to multiple formats' }
  ];

  techStack: TechItem[] = [
    { name: 'Angular 19', category: 'Frontend' },
    { name: 'PrimeNG', category: 'Frontend' },
    { name: 'Spring Boot', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' }
  ];

  constructor(public ref: DynamicDialogRef) {}

  close(): void {
    this.ref.close();
  }
}
