import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = false;
  isDarkMode = false;
  isMobile = false;

  constructor(private themeService: ThemeService) {}

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
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.sidebarVisible = false;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
