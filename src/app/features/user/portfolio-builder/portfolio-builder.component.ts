import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { MessageService } from 'primeng/api';
import { Portfolio } from '../../../core/models/portfolio.model';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    TabMenuModule,
    DropdownModule,
    ToggleButtonModule,
    FormsModule,
    TabViewModule
  ],
  templateUrl: './portfolio-builder.component.html',
  styleUrls: ['./portfolio-builder.component.scss']
})
export class PortfolioBuilderComponent {
  menuItems: MenuItem[] = [
    { label: 'Informations', icon: 'pi pi-user', routerLink: '/portfolio-builder/informations' },
    { label: 'Compétences', icon: 'pi pi-star', routerLink: '/portfolio-builder/competences' },
    { label: 'Projets', icon: 'pi pi-briefcase', routerLink: '/portfolio-builder/projets' },
    { label: 'Expériences', icon: 'pi pi-building', routerLink: '/portfolio-builder/experiences' },
    { label: 'Éducation', icon: 'pi pi-book', routerLink: '/portfolio-builder/educations' },
    { label: 'Témoignages', icon: 'pi pi-comments', routerLink: '/portfolio-builder/temoignages' },
    { label: 'Services', icon: 'pi pi-cog', routerLink: '/portfolio-builder/services' },
    { label: 'Réseaux Sociaux', icon: 'pi pi-share-alt', routerLink: '/portfolio-builder/reseaux-sociaux' },
    { label: 'Gestion des Types', icon: 'pi pi-tags', routerLink: '/portfolio-builder/types-management' }
  ];

  activeItem: MenuItem = this.menuItems[0];

  currentPortfolio: Portfolio | null = null;

  statutOptions = [
    { label: 'Actif', value: 'actif' },
    { label: 'Brouillon', value: 'brouillon' },
    { label: 'Archivé', value: 'archive' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Charger le portfolio actuel si on est en mode édition
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadPortfolio(params['id']);
      } else {
        // Nouveau portfolio
        this.currentPortfolio = {
          id: 'new',
          nom: 'Nouveau Portfolio',
          url: '',
          template: 'Modern Pro',
          statut: 'brouillon',
          dateCreation: new Date(),
          derniereModification: new Date(),
          vues: 0,
          utilisateurId: '1',
          isPublic: false
        };
      }
    });
  }

  loadPortfolio(id: string) {
    // Simulation de chargement du portfolio
    this.currentPortfolio = {
      id: id,
      nom: 'Mon Portfolio Professionnel',
      url: 'johndoe.quickfolio.com',
      template: 'Modern Pro',
      statut: 'actif',
      dateCreation: new Date('2024-01-15'),
      derniereModification: new Date(),
      vues: 1247,
      utilisateurId: '1',
      isPublic: true
    };
  }

  onStatusChange(newStatus: string) {
    if (this.currentPortfolio) {
      this.portfolioService.updatePortfolioStatus(this.currentPortfolio.id, newStatus as any).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Statut mis à jour',
            detail: `Portfolio maintenant en mode ${newStatus}`
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le statut'
          });
        }
      });
    }
  }

  onVisibilityChange() {
    if (this.currentPortfolio) {
      this.portfolioService.updatePortfolioVisibility(this.currentPortfolio.id, this.currentPortfolio.isPublic).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Visibilité mise à jour',
            detail: `Portfolio ${this.currentPortfolio!.isPublic ? 'public' : 'privé'}`
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la visibilité'
          });
        }
      });
    }
  }

  onTabChange(item: MenuItem) {
    this.activeItem = item;
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  previewPortfolio() {
    // TODO: Implémenter l'aperçu du portfolio
    console.log('Aperçu du portfolio');
  }
}