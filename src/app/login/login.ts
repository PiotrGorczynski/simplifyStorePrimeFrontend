import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {Password} from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    Password
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  constructor(private router: Router) {}
  emailValue: string = '';
  passwordValue: string = '';

  onLogin() {
    console.log('Logged as:', this.emailValue);
    this.router.navigate(['/dashboard']);
  }
}
