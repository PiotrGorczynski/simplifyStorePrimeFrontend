import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUpComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  usernameTouched = false;
  emailTouched = false;
  passwordTouched = false;
  confirmPasswordTouched = false;

  isLoading = false;
  isDarkMode = false;

  constructor(
    private router: Router,
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

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  isFormValid(): boolean {
    return (
      this.username.length > 0 &&
      this.isValidEmail() &&
      this.password.length >= 6 &&
      this.passwordsMatch()
    );
  }

  onSubmit(): void {
    this.usernameTouched = true;
    this.emailTouched = true;
    this.passwordTouched = true;
    this.confirmPasswordTouched = true;

    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all fields correctly',
        life: 3000
      });
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Account Created!',
        detail: `Welcome to Simplify Store Prime, ${this.username}!`,
        life: 4000
      });

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 1500);
  }
}
