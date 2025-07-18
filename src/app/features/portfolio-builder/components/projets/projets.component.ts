import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Projet, TypeProjet } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, DropdownModule, ChipsModule,
    TableModule, DialogModule, ConfirmDialogModule, FileUploadModule
  ],
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit {
  projets: Projet[] = [];
  typesProjets: TypeProjet[] = [];
  projetForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentProjet: Projet | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.projetForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      technologies: [[]],
      lienDemo: [''],
      projetImage: [''],
      typeProjetId: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    this.loadProjets();
    this.loadTypesProjets();
  }
  
  loadProjets() {
    this.projets = this.portfolioService.getProjets();
  }
  
  loadTypesProjets() {
    this.portfolioService.getTypesProjets().subscribe(types => {
      this.typesProjets = types;
    });
  }
  
  showDialog() {
    this.editMode = false;
    this.currentProjet = null;
    this.projetForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editProjet(projet: Projet) {
    this.editMode = true;
    this.currentProjet = projet;
    this.projetForm.patchValue(projet);
    this.displayDialog = true;
  }
  
  saveProjet() {
    if (this.projetForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.projetForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentProjet
        ? this.portfolioService.updateProjet(this.currentProjet.id, data)
        : this.portfolioService.addProjet(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Projet ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadProjets();
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
  
  deleteProjet(projet: Projet) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le projet "${projet.titre}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteProjet(projet.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Projet supprimé avec succès'
            });
            this.loadProjets();
          }
        });
      }
    });
  }
  
  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // TODO: Implémenter l'upload d'image
      console.log('Image sélectionnée:', file);
    }
  }
  
  getTypeProjetName(typeId: string): string {
    return this.typesProjets.find(t => t.id === typeId)?.nom || '';
  }
}