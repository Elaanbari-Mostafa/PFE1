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
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Service } from '../../../../core/models/portfolio.model';
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
    { label: 'Code', value: 'pi pi-code' },
    { label: 'Design', value: 'pi pi-palette' },
    { label: 'Mobile', value: 'pi pi-mobile' },
    { label: 'Web', value: 'pi pi-globe' },
    { label: 'Database', value: 'pi pi-database' },
    { label: 'Cloud', value: 'pi pi-cloud' },
    { label: 'Analytics', value: 'pi pi-chart-bar' },
    { label: 'Security', value: 'pi pi-shield' },
    { label: 'Support', value: 'pi pi-headphones' },
    { label: 'Consulting', value: 'pi pi-users' },
    { label: 'Settings', value: 'pi pi-cog' },
    { label: 'Tools', value: 'pi pi-wrench' }
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
      icone: ['pi pi-cog', Validators.required]
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
    this.serviceForm.patchValue({ icone: 'pi pi-cog' });
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