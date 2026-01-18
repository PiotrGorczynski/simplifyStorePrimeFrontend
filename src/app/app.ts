import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button, ButtonModule} from 'primeng/button';
import {LoadingBarComponent} from './services/loading/loading-bar/loading-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, LoadingBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('simplifyStorePrimeFrontend');
}
