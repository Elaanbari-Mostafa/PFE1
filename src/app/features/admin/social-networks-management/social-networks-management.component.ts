import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

interface SocialNetwork {
  id: string;
  nom: string;
  icone: string;
  baseUrl: string;
  active: boolean;
}

@Component({
  selector: 'app-social-networks-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  templateUrl: './social-networks-management.component.html',
  styleUrls: ['./social-networks-management.component.scss']
})
export class SocialNetworksManagementComponent implements OnInit {
  socialNetworks: SocialNetwork[] = [];
  showDialog = false;
  currentNetwork: any = {};
  loading = false;

  iconesDisponibles = [
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSocialNetworks();
  }

  loadSocialNetworks() {
    this.socialNetworks = [
      {
        id: '1',
        nom: 'LinkedIn',
        icone: 'pi pi-linkedin',
        baseUrl: 'https://linkedin.com/in/',
        active: true
      },
      {
        id: '2',
        nom: 'GitHub',
        icone: 'pi pi-github',
        baseUrl: 'https://github.com/',
        active: true
      },
      {
        id: '3',
        nom: 'Twitter',
        icone: 'pi pi-twitter',
        baseUrl: 'https://twitter.com/',
        active: false
      }
    ];
  }

  showAddDialog() {
    this.currentNetwork = { active: true };
    this.showDialog = true;
  }

  hideDialog() {
    this.showDialog = false;
  }

  editNetwork(network: SocialNetwork) {
    this.currentNetwork = { ...network };
    this.showDialog = true;
  }

  saveNetwork() {
    this.loading = true;
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Réseau social sauvegardé',
        detail: 'Le réseau social a été sauvegardé avec succès'
      });
      this.hideDialog();
      this.loadSocialNetworks();
      this.loading = false;
    }, 1000);
  }

  toggleNetworkStatus(network: SocialNetwork) {
    network.active = !network.active;
    this.messageService.add({
      severity: 'success',
      summary: 'Statut mis à jour',
      detail: `${network.nom} est maintenant ${network.active ? 'activé' : 'désactivé'}`
    });
  }

  deleteNetwork(network: SocialNetwork) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${network.nom} ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Réseau supprimé',
          detail: `${network.nom} a été supprimé`
        });
        this.loadSocialNetworks();
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}