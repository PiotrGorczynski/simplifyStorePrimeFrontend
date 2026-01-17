import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent implements OnInit {
  username = '';
  password = '';
  isDarkMode = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.png' : 'logo.png';
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  onSubmit(): void {
    if (this.username === 'login' && this.password === 'password') {

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', this.username);
      localStorage.setItem('loginTime', new Date().toISOString());

      this.messageService.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: `Welcome back, ${this.username}!`,
        life: 2000
      });

      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      setTimeout(() => {
        this.router.navigate([returnUrl]);
      }, 500);

    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Invalid username or password',
        life: 3000
      });
    }
  }
}
