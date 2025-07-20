import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  showUserDialog = false;
  searchTerm = '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Simulation de données utilisateurs
    this.users = [
      {
        id: '1',
        nom: 'ELAANBARI',
        prenom: 'Mostafa',
        email: 'm.elaanbari@email.com',
        nomUtilisateur: 'elaanbari',
        titreProf: 'Designer UX/UI',
        adresse: 'casablanca, maroc',
        surNom: '',
        role: 'user',
        abonnement: {
          id: '1',
          statut: 'actif',
          planAbonnementId: 'mensuel',
          dateDebut: new Date('2025-05-01'),
          dateFin: new Date('2025-06-01'),
          utilisateurId: '1'
        },
        createdAt: new Date('2025-05-01'),
        updatedAt: new Date('2025-05-15')
      },
      {
        id: '2',
        nom: 'mohammed',
        prenom: 'salan',
        email: 's.mohammed@email.com',
        nomUtilisateur: 'salan',
        titreProf: 'Développeur Full Stack',
        adresse: 'Lyon, France',
        surNom: '',
        role: 'user',
        abonnement: {
          id: '2',
          statut: 'actif',
          planAbonnementId: 'annuel',
          dateDebut: new Date('2025-05-15'),
          dateFin: new Date('2026-05-16'),
          utilisateurId: '2'
        },
        createdAt: new Date('2025-05-15'),
        updatedAt: new Date('2025-05-15')
      }
    ];
    this.filteredUsers = [...this.users];
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.nomUtilisateur.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewUser(user: User) {
    this.selectedUser = user;
    this.showUserDialog = true;
  }

  editUser(user: User) {
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité',
      detail: 'Édition d\'utilisateur à implémenter'
    });
  }

  activateUser(user: User) {
    this.messageService.add({
      severity: 'success',
      summary: 'Utilisateur activé',
      detail: `${user.prenom} ${user.nom} a été activé`
    });
  }

  deactivateUser(user: User) {
    this.confirmationService.confirm({
      message: `Voulez-vous désactiver l'utilisateur ${user.prenom} ${user.nom} ?`,
      header: 'Désactiver l\'utilisateur',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur désactivé',
          detail: `${user.prenom} ${user.nom} a été désactivé`
        });
      }
    });
  }

  suspendUser(user: User) {
    this.confirmationService.confirm({
      message: `Voulez-vous suspendre l'utilisateur ${user.prenom} ${user.nom} ?`,
      header: 'Suspendre l\'utilisateur',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur suspendu',
          detail: `${user.prenom} ${user.nom} a été suspendu`
        });
      }
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.prenom} ${user.nom} ? Cette action est irréversible.`,
      header: 'Supprimer l\'utilisateur',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.filterUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur supprimé',
          detail: `${user.prenom} ${user.nom} a été supprimé`
        });
      }
    });
  }

  getSubscriptionLabel(user: User): string {
    if (!user.abonnement) return 'Aucun';
    return user.abonnement.planAbonnementId;
  }

  getSubscriptionSeverity(user: User): string {
    if (!user.abonnement) return 'secondary';
    switch (user.abonnement.statut) {
      case 'actif': return 'success';
      case 'expire': return 'danger';
      case 'suspendu': return 'warning';
      default: return 'secondary';
    }
  }
  
  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}