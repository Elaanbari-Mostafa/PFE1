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
import { Service } from '../../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, DropdownModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  serviceForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentService: Service | null = null;
  loading = false;
  
  iconesDisponibles = [
   // Services Web & Tech
  { label: 'Développement Web', value: 'pi pi-code' },
  { label: 'Design UI/UX', value: 'pi pi-palette' },
  { label: 'Mobile App', value: 'pi pi-mobile' },
  { label: 'E-commerce', value: 'pi pi-shopping-cart' },
  { label: 'SEO/Marketing', value: 'pi pi-search' },
  { label: 'Hébergement Web', value: 'pi pi-server' },
  { label: 'Base de Données', value: 'pi pi-database' },
  { label: 'Cloud Services', value: 'pi pi-cloud' },
  { label: 'API Development', value: 'pi pi-cog' },
  { label: 'DevOps', value: 'pi pi-wrench' },

  // Services Business
  { label: 'Consulting', value: 'pi pi-briefcase' },
  { label: 'Formation', value: 'pi pi-book' },
  { label: 'Support Client', value: 'pi pi-headphones' },
  { label: 'Maintenance', value: 'pi pi-wrench' },
  { label: 'Audit', value: 'pi pi-search-plus' },
  { label: 'Project Management', value: 'pi pi-calendar' },
  { label: 'Analytics', value: 'pi pi-chart-line' },
  { label: 'Sécurité', value: 'pi pi-shield' },

  // Services Créatifs
  { label: 'Graphisme', value: 'pi pi-image' },
  { label: 'Photographie', value: 'pi pi-camera' },
  { label: 'Vidéo', value: 'pi pi-video' },
  { label: 'Animation', value: 'pi pi-play' },
  { label: 'Branding', value: 'pi pi-star' },
  { label: 'Print Design', value: 'pi pi-print' },
  { label: 'Illustration', value: 'pi pi-pencil' },

  // Services Financiers
  { label: 'Comptabilité', value: 'pi pi-calculator' },
  { label: 'Finance', value: 'pi pi-dollar' },
  { label: 'Investissement', value: 'pi pi-chart-bar' },
  { label: 'Assurance', value: 'pi pi-shield' },
  { label: 'Banque', value: 'pi pi-credit-card' },

  // Services Communication
  { label: 'Rédaction', value: 'pi pi-file-edit' },
  { label: 'Traduction', value: 'pi pi-globe' },
  { label: 'Relations Publiques', value: 'pi pi-megaphone' },
  { label: 'Email Marketing', value: 'pi pi-envelope' },
  { label: 'Réseaux Sociaux', value: 'pi pi-share-alt' },

  // Services Professionnels
  { label: 'Juridique', value: 'pi pi-balance-scale' },
  { label: 'Immobilier', value: 'pi pi-home' },
  { label: 'Architecture', value: 'pi pi-building' },
  { label: 'Ingénierie', value: 'pi pi-cog' },
  { label: 'Santé', value: 'pi pi-heart' },
  { label: 'Éducation', value: 'pi pi-graduation-cap' },

  // Services Logistiques
  { label: 'Transport', value: 'pi pi-truck' },
  { label: 'Livraison', value: 'pi pi-send' },
  { label: 'Stockage', value: 'pi pi-warehouse' },
  { label: 'Supply Chain', value: 'pi pi-sitemap' },

  // Services Généraux
  { label: 'Nettoyage', value: 'pi pi-refresh' },
  { label: 'Réparation', value: 'pi pi-wrench' },
  { label: 'Installation', value: 'pi pi-cog' },
  { label: 'Événementiel', value: 'pi pi-calendar-plus' },
  { label: 'Autre Service', value: 'pi pi-ellipsis-h' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.serviceForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      icone: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    this.loadServices();
  }
  
  loadServices() {
    this.services = this.portfolioService.getServices();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentService = null;
    this.serviceForm.reset();
    // this.serviceForm.patchValue({ icone: 'pi pi-cog' });
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editService(service: Service) {
    this.editMode = true;
    this.currentService = service;
    this.serviceForm.patchValue(service);
    this.displayDialog = true;
  }
  
  saveService() {
    if (this.serviceForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.serviceForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentService
        ? this.portfolioService.updateService(this.currentService.id, data)
        : this.portfolioService.addService(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Service ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadServices();
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
  
  deleteService(service: Service) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le service "${service.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteService(service.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Service supprimé avec succès'
            });
            this.loadServices();
          }
        });
      }
    });
  }
  
  getIconLabel(iconValue: string): string {
    const icon = this.iconesDisponibles.find(i => i.value === iconValue);
    return icon?.label || 'Icône';
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}