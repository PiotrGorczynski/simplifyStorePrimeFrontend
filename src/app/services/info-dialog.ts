import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InfoAboutAuthorComponent } from '../components/info-about-author/info-about-author';
import { InfoAboutAppComponent } from '../components/info-about-app/info-about-app';

@Injectable({
  providedIn: 'root'
})
export class InfoDialogService {
  constructor(private dialogService: DialogService) {}

  showAuthorInfo(): void {
    this.dialogService.open(InfoAboutAuthorComponent, {
      header: 'Info about an Author',
      width: '600px',
      modal: true,
      dismissableMask: true,
      styleClass: 'info-dialog'
    });
  }

  showAppInfo(): void {
    this.dialogService.open(InfoAboutAppComponent, {
      header: 'Info about the App',
      width: '600px',
      modal: true,
      dismissableMask: true,
      styleClass: 'info-dialog'
    });
  }
}
