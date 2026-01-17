import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme === 'dark';

      if (isDark) {
        this.enableDarkMode();
      }
    }
  }

  toggleDarkMode(): void {
    if (this.darkModeSubject.value) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    if (this.isBrowser) {
      document.documentElement.classList.add('my-app-dark');
      this.darkModeSubject.next(true);
      localStorage.setItem('theme', 'dark');
    }
  }

  private disableDarkMode(): void {
    if (this.isBrowser) {
      document.documentElement.classList.remove('my-app-dark');
      this.darkModeSubject.next(false);
      localStorage.setItem('theme', 'light');
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
