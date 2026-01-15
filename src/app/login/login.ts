import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

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
