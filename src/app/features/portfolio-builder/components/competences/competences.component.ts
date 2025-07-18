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
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Competence, TypeCompetence } from '../../../../core/models/portfolio.model';

@Component({
  selector: 'app-competences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    TagModule,
    SliderModule,
    ProgressBarModule
  ],
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss']
})
export class CompetencesComponent implements OnInit {
  competences: Competence[] = [];
  typesCompetences: TypeCompetence[] = [];
  competenceForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentCompetence: Competence | null = null;
  loading = false;
  niveauValue = 50;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.competenceForm = this.fb.group({
      nom: ['', Validators.required],
      typeCompetenceId: ['', Validators.required],
      niveau: [50, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    // Écouter les changements du niveau pour l'affichage
    this.competenceForm.get('niveau')?.valueChanges.subscribe(value => {
      this.niveauValue = value;
    });
  }
  
  ngOnInit() {
    this.loadCompetences();
    this.loadTypesCompetences();
  }
  
  loadCompetences() {
    this.competences = this.portfolioService.getCompetences();
  }
  
  loadTypesCompetences() {
    this.portfolioService.getTypesCompetences().subscribe(types => {
      this.typesCompetences = types;
    });
  }
  
  showDialog() {
    this.editMode = false;
    this.currentCompetence = null;
    this.competenceForm.reset();
    this.competenceForm.patchValue({ niveau: 50 });
    this.niveauValue = 50;
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
    this.competenceForm.reset();
  }
  
  editCompetence(competence: Competence) {
    this.editMode = true;
    this.currentCompetence = competence;
    this.competenceForm.patchValue(competence);
    this.niveauValue = competence.niveau;
    this.displayDialog = true;
  }
  
  saveCompetence() {
    if (this.competenceForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.competenceForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentCompetence
        ? this.portfolioService.updateCompetence(this.currentCompetence.id, data)
        : this.portfolioService.addCompetence(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Compétence ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès`
          });
          this.loadCompetences();
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
  
  deleteCompetence(competence: Competence) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la compétence "${competence.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteCompetence(competence.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Compétence supprimée avec succès'
            });
            this.loadCompetences();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression'
            });
          }
        });
      }
    });
  }
  
  getTypeCompetenceName(typeId: string): string {
    const type = this.typesCompetences.find(t => t.id === typeId);
    return type?.nom || '';
  }
  
  getNiveauLabel(niveau: number): string {
    if (niveau <= 25) return 'Débutant';
    if (niveau <= 50) return 'Intermédiaire';
    if (niveau <= 75) return 'Avancé';
    return 'Expert';
  }
  
  getNiveauSeverity(niveau: number): string {
    if (niveau <= 25) return 'secondary';
    if (niveau <= 50) return 'warning';
    if (niveau <= 75) return 'info';
    return 'success';
  }
  
  get nom() { return this.competenceForm.get('nom'); }
  get typeCompetenceId() { return this.competenceForm.get('typeCompetenceId'); }
  get niveau() { return this.competenceForm.get('niveau'); }
}