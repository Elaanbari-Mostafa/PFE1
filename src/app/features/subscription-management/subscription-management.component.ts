import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';
import { PlanAbonnement, Abonnement } from '../../core/models/user.model';

interface HistoriqueAbonnement {
  id: string;
  planNom: string;
  dateDebut: Date;
  dateFin: Date;
  statut: 'actif' | 'expire' | 'annule';
  montant: number;
  methodePaiement: string;
}

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
    InputTextModule
  ],
  templateUrl: './subscription-management.component.html',
  styleUrls: ['./subscription-management.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class SubscriptionManagementComponent implements OnInit {
  plans: PlanAbonnement[] = [];
  currentSubscription: Abonnement | null = null;
  historiqueAbonnements: HistoriqueAbonnement[] = [];
  showPlans = false;
  loading = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading = true;

    Promise.all([
      this.loadPlans(),
      this.loadCurrentSubscription(),
      this.loadHistoriqueAbonnements()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadPlans(): Promise<void> {
    return new Promise((resolve) => {
      this.subscriptionService.getPlans().subscribe({
        next: (plans) => {
          this.plans = plans;
          resolve();
        },
        error: (error) => {
          console.error('Error loading plans:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les plans'
          });
          resolve();
        }
      });
    });
  }

  private loadCurrentSubscription(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const user = this.authService.getCurrentUser();
        this.currentSubscription = user?.abonnement || null;
        resolve();
      } catch (error) {
        console.error('Error loading current subscription:', error);
        resolve();
      }
    });
  }

  private loadHistoriqueAbonnements(): Promise<void> {
    return new Promise((resolve) => {
      // Simulation de données d'historique avec plus de variété
      this.historiqueAbonnements = [
        {
          id: '3',
          planNom: 'Plan Annuel',
          dateDebut: new Date('2024-02-01'),
          dateFin: new Date('2025-02-01'),
          statut: 'actif',
          montant: 690,
          methodePaiement: 'Carte bancaire'
        },
        {
          id: '1',
          planNom: 'Plan Mensuel',
          dateDebut: new Date('2024-01-01'),
          dateFin: new Date('2024-02-01'),
          statut: 'expire',
          montant: 69,
          methodePaiement: 'PayPal'
        },
        {
          id: '2',
          planNom: 'Essai Gratuit',
          dateDebut: new Date('2023-12-01'),
          dateFin: new Date('2023-12-04'),
          statut: 'expire',
          montant: 0,
          methodePaiement: 'Gratuit'
        },
        {
          id: '5',
          planNom: 'Plan Mensuel',
          dateDebut: new Date('2023-06-01'),
          dateFin: new Date('2023-09-01'),
          statut: 'expire',
          montant: 69,
          methodePaiement: 'PayPal'
        }
      ];
      resolve();
    });
  }

  getCurrentPlanName(): string {
    if (!this.currentSubscription) return 'Aucun plan';
    const plan = this.plans.find(p => p.id === this.currentSubscription?.planAbonnementId);
    return plan?.nom || 'Plan inconnu';
  }

  getDaysLeft(): number {
    const daysLeft = this.authService.getSubscriptionDaysLeft();
    return Math.max(0, daysLeft);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'actif': 'Actif',
      'expire': 'Expiré',
      'suspendu': 'Suspendu',
      'annule': 'Annulé'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'actif': 'success',
      'expire': 'danger',
      'suspendu': 'warning',
      'annule': 'warning'
    };
    return severities[status] || 'info';
  }

  getHistoriqueStatusLabel(status: string): string {
    return this.getStatusLabel(status);
  }

  isCurrentPlan(plan: PlanAbonnement): boolean {
    return this.currentSubscription?.planAbonnementId === plan.id;
  }

  selectPlan(plan: PlanAbonnement) {
    if (this.isCurrentPlan(plan)) {
      return;
    }

    const isUpgrade = this.isUpgrade(plan);
    const action = isUpgrade ? 'mise à niveau' : 'changement';

    this.confirmationService.confirm({
      message: `Voulez-vous effectuer un ${action} vers le plan "${plan.nom}" ?`,
      header: `${isUpgrade ? 'Mise à niveau' : 'Changement'} de plan`,
      icon: 'pi pi-question-circle',
      acceptLabel: 'Confirmer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.loading = true;
        this.subscriptionService.updateSubscription(plan.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Plan mis à jour',
              detail: `Vous êtes maintenant abonné au plan ${plan.nom}`
            });
            this.loadCurrentSubscription();
            this.showPlans = false;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating subscription:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de mettre à jour le plan'
            });
            this.loading = false;
          }
        });
      },
      reject: () => {
        // Action annulée
      }
    });
  }

  private isUpgrade(newPlan: PlanAbonnement): boolean {
    if (!this.currentSubscription) return true;

    const currentPlan = this.plans.find(p => p.id === this.currentSubscription?.planAbonnementId);
    if (!currentPlan) return true;

    return newPlan.prix > currentPlan.prix;
  }

  cancelSubscription() {
    if (!this.currentSubscription || this.currentSubscription.statut !== 'actif') {
      return;
    }

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action est irréversible.',
      header: 'Annuler l\'abonnement',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, annuler',
      rejectLabel: 'Non, garder',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.loading = true;
        this.subscriptionService.cancelSubscription().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Abonnement annulé',
              detail: 'Votre abonnement a été annulé avec succès'
            });
            this.loadCurrentSubscription();
            this.loadHistoriqueAbonnements();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error canceling subscription:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible d\'annuler l\'abonnement'
            });
            this.loading = false;
          }
        });
      },
      reject: () => {
        // Action annulée
      }
    });
  }

  onGlobalFilter(event: any) {
    const table = document.querySelector('p-table');
    if (table) {
      // Implémentation du filtre global
      const filterValue = (event.target as HTMLInputElement).value;
      // Cette méthode devrait être implémentée selon la version de PrimeNG utilisée
      console.log('Filter value:', filterValue);
    }
  }

  // Méthodes utilitaires pour l'affichage
  getSubscriptionStatusClass(): string {
    if (!this.currentSubscription) return '';

    const daysLeft = this.getDaysLeft();
    if (daysLeft < 7) return 'text-danger';
    if (daysLeft < 30) return 'text-warning';
    return 'text-success';
  }

  getSubscriptionStatusIcon(): string {
    if (!this.currentSubscription) return 'pi-info-circle';

    switch (this.currentSubscription.statut) {
      case 'actif': return 'pi-check-circle';
      case 'expire': return 'pi-times-circle';
      case 'suspendu': return 'pi-pause-circle';
      default: return 'pi-info-circle';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getPaymentMethodIcon(method: string): string {
    switch (method.toLowerCase()) {
      case 'paypal': return 'pi-paypal';
      case 'carte bancaire': return 'pi-credit-card';
      case 'gratuit': return 'pi-gift';
      default: return 'pi-credit-card';
    }
  }

  // Méthodes pour la gestion des états de chargement
  isLoading(): boolean {
    return this.loading;
  }

  // Méthodes pour la navigation
  goToPayment(planId: string) {
    this.router.navigate(['/payment'], { queryParams: { planId } });
  }

  goToBilling() {
    this.router.navigate(['/billing']);
  }

  // Méthodes pour la gestion des erreurs
  private handleError(error: any, operation: string) {
    console.error(`${operation} failed:`, error);
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: `Une erreur s'est produite lors de ${operation}`
    });
  }

  // Méthodes pour les animations
  togglePlansVisibility() {
    this.showPlans = !this.showPlans;
  }

  // Méthodes pour la responsive design
  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  // Méthodes pour l'accessibilité
  getAriaLabel(plan: PlanAbonnement): string {
    return `Plan ${plan.nom}, ${plan.prix} euros pour ${plan.dureeEnJours} jours`;
  }

  // Méthodes pour la validation
  canChangePlan(): boolean {
    return this.currentSubscription?.statut === 'actif';
  }

  canCancelSubscription(): boolean {
    return this.currentSubscription?.statut === 'actif';
  }

  // Méthodes pour les statistiques
  getTotalSpent(): number {
    return this.historiqueAbonnements
      .filter(h => h.statut !== 'annule')
      .reduce((total, h) => total + h.montant, 0);
  }

  getActiveSubscriptionsCount(): number {
    return this.historiqueAbonnements.filter(h => h.statut === 'actif').length;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  // Méthodes pour les notifications
  showSubscriptionReminder() {
    const daysLeft = this.getDaysLeft();
    if (daysLeft > 0 && daysLeft <= 7) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Rappel',
        detail: `Votre abonnement expire dans ${daysLeft} jour(s)`,
        life: 5000
      });
    }
  }
}