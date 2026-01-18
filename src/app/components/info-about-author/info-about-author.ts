import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

interface Technology {
  name: string;
  icon: string;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-info-about-author',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './info-about-author.html',
  styleUrl: './info-about-author.scss',
  encapsulation: ViewEncapsulation.None
})
export class InfoAboutAuthorComponent {

  technologies: Technology[] = [
    { name: 'Java', icon: 'devicon-java-plain' },
    { name: 'Spring Boot', icon: 'devicon-spring-plain' },
    { name: 'Angular', icon: 'devicon-angular-plain' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain' },
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
    { name: 'Git', icon: 'devicon-git-plain' }
  ];

  socialLinks: SocialLink[] = [
    { name: 'GitHub', icon: 'pi pi-github', url: 'https://github.com/PiotrGorczynski' },
    { name: 'LinkedIn', icon: 'pi pi-linkedin', url: 'https://www.linkedin.com/in/piotrg4/' },
    { name: 'Email', icon: 'pi pi-envelope', url: 'mailto:p.gorczynski4@gmail.com' }
  ];

  constructor(public ref: DynamicDialogRef) {}

  close(): void {
    this.ref.close();
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }
}
