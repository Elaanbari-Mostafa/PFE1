import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

interface ThemeInfo {
  id: string;
  nom: string;
  active: boolean;
  image: string;
  usageCount: number;
}

@Component({
  selector: 'app-admin-theme-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    DialogModule,
    InputTextModule,
    FileUploadModule,
    ToggleButtonModule
  ],
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.scss']
})
export class AdminThemeManagementComponent implements OnInit {
  themes: ThemeInfo[] = [];
  showDialog = false;
  currentTheme: any = {};
  loading = false;

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadThemes();
  }

  loadThemes() {
    this.themes = [
      {
        id: '1',
        nom: 'Modern Pro',
        active: true,
        image: '../../../assets/images/temp1.png',
        usageCount: 245
      },
      {
        id: '2',
        nom: 'Creative Studio',
        active: true,
        image: '../../../assets/images/temp2.png',
        usageCount: 156
      }
    ];
  }

  showAddDialog() {
    this.currentTheme = { active: true };
    this.showDialog = true;
  }

  hideDialog() {
    this.showDialog = false;
  }

  editTheme(theme: ThemeInfo) {
    this.currentTheme = { ...theme };
    this.showDialog = true;
  }

  saveTheme() {
    this.loading = true;
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Thème sauvegardé',
        detail: 'Le thème a été sauvegardé avec succès'
      });
      this.hideDialog();
      this.loadThemes();
      this.loading = false;
    }, 1000);
  }

  toggleThemeStatus(theme: ThemeInfo) {
    theme.active = !theme.active;
    this.messageService.add({
      severity: 'success',
      summary: 'Statut mis à jour',
      detail: `Le thème ${theme.nom} est maintenant ${theme.active ? 'activé' : 'désactivé'}`
    });
  }

  deleteTheme(theme: ThemeInfo) {
    this.messageService.add({
      severity: 'success',
      summary: 'Thème supprimé',
      detail: `Le thème ${theme.nom} a été supprimé`
    });
    this.loadThemes();
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      console.log('Image sélectionnée:', file);
      // TODO: Implémenter l'upload d'image
    }
  }
  
  goBack() {
    this.router.navigate(['/admin']);
  }
}