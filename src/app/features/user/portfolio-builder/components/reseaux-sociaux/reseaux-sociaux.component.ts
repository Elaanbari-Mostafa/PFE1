import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PortfolioService } from '../../../../../core/services/portfolio.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { ReseauSocial } from '../../../../../core/models/portfolio.model';

@Component({
  selector: 'app-reseaux-sociaux',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    DropdownModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  templateUrl: './reseaux-sociaux.component.html',
  styleUrls: ['./reseaux-sociaux.component.scss']
})
export class ReseauxSociauxComponent implements OnInit {
  reseauxSociaux: ReseauSocial[] = [];
  reseauForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentReseau: ReseauSocial | null = null;
  loading = false;

  reseauxDisponibles = [
    { label: 'LinkedIn', value: 'pi pi-linkedin' },
    { label: 'GitHub', value: 'pi pi-github' },
    { label: 'Twitter', value: 'pi pi-twitter' },
    { label: 'Instagram', value: 'pi pi-instagram' },
    { label: 'Facebook', value: 'pi pi-facebook' },
    { label: 'YouTube', value: 'pi pi-youtube' },
    { label: 'TikTok', value: 'pi pi-tiktok' },
    { label: 'WhatsApp', value: 'pi pi-whatsapp' },
    { label: 'Telegram', value: 'pi pi-send' },
    { label: 'Discord', value: 'pi pi-discord' },
    { label: 'Slack', value: 'pi pi-slack' },
    { label: 'Snapchat', value: 'pi pi-camera' },
    { label: 'Pinterest', value: 'pi pi-bookmark' },
    { label: 'Reddit', value: 'pi pi-reddit' },
    { label: 'Twitch', value: 'pi pi-twitch' },
    { label: 'Behance', value: 'pi pi-palette' },
    { label: 'Dribbble', value: 'pi pi-circle' },
    { label: 'Medium', value: 'pi pi-book' },
    { label: 'Vimeo', value: 'pi pi-video' },
    { label: 'Skype', value: 'pi pi-phone' },
    { label: 'Zoom', value: 'pi pi-video' },
    { label: 'Website', value: 'pi pi-globe' },
    { label: 'Email', value: 'pi pi-envelope' },
    { label: 'Blog', value: 'pi pi-file-edit' },
    { label: 'Portfolio', value: 'pi pi-briefcase' },
    { label: 'Apple', value: 'pi pi-apple' },
    { label: 'Google', value: 'pi pi-google' },
    { label: 'Microsoft', value: 'pi pi-microsoft' },
    { label: 'Autre', value: 'pi pi-link' },
    { label: 'TikTok', value: 'pi pi-play' },
    { label: 'Discord', value: 'pi pi-comments' },
    { label: 'Reddit', value: 'pi pi-comment' },
    { label: 'Twitch', value: 'pi pi-video' }
  ];

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.reseauForm = this.fb.group({
      nom: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit() {
    this.loadReseauxSociaux();
  }

  loadReseauxSociaux() {
    this.reseauxSociaux = this.portfolioService.getReseauxSociaux();
  }

  showDialog() {
    this.editMode = false;
    this.currentReseau = null;
    this.reseauForm.reset();
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  editReseau(reseau: ReseauSocial) {
    this.editMode = true;
    this.currentReseau = reseau;
    this.reseauForm.patchValue(reseau);
    this.displayDialog = true;
  }

  saveReseau() {
    if (this.reseauForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();

      const data = {
        ...this.reseauForm.value,
        utilisateurId: user?.id || '1',
        icone: this.getReseauIcon(this.reseauForm.value.nom)
      };

      const operation = this.editMode && this.currentReseau
        ? this.portfolioService.updateReseauSocial(this.currentReseau.id, data)
        : this.portfolioService.addReseauSocial(data);

      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Réseau social ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadReseauxSociaux();
          this.hideDialog();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la sauvegarde'
          });
          this.loading = false;
        }
      });
    }
  }

  deleteReseau(reseau: ReseauSocial) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le réseau "${reseau.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteReseauSocial(reseau.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Réseau social supprimé avec succès'
            });
            this.loadReseauxSociaux();
          }
        });
      }
    });
  }

  getReseauIcon(nom: string): string {
    const icons: { [key: string]: string } = {
      'LinkedIn': 'pi pi-linkedin',
      'GitHub': 'pi pi-github',
      'Twitter': 'pi pi-twitter',
      'Instagram': 'pi pi-instagram',
      'Facebook': 'pi pi-facebook',
      'Behance': 'pi pi-palette',
      'Dribbble': 'pi pi-circle',
      'YouTube': 'pi pi-video'
    };
    return icons[nom] || 'pi pi-link';
  }
}