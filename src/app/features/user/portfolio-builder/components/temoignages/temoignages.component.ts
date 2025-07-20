import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { PortfolioService } from '../../../../../core/services/portfolio.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Temoignage } from '../../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-temoignages',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, InputTextModule,
    TextareaModule, TableModule, DialogModule, ConfirmDialogModule, 
    FileUploadModule, RatingModule
  ],
  templateUrl: './temoignages.component.html',
  styleUrls: ['./temoignages.component.scss']
})
export class TemoignagesComponent implements OnInit {
  temoignages: Temoignage[] = [];
  temoignageForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentTemoignage: Temoignage | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.temoignageForm = this.fb.group({
      auteur: ['', Validators.required],
      poste: ['', Validators.required],
      entreprise: ['', Validators.required],
      contenu: ['', Validators.required],
      rate: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      photo: ['']
    });
  }
  
  ngOnInit() {
    this.loadTemoignages();
  }
  
  loadTemoignages() {
    this.temoignages = this.portfolioService.getTemoignages();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentTemoignage = null;
    this.temoignageForm.reset();
    this.temoignageForm.patchValue({ rate: 5 });
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editTemoignage(temoignage: Temoignage) {
    this.editMode = true;
    this.currentTemoignage = temoignage;
    this.temoignageForm.patchValue(temoignage);
    this.displayDialog = true;
  }
  
  saveTemoignage() {
    if (this.temoignageForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.temoignageForm.value,
        utilisateurId: user?.id || '1',
        dateCreation: new Date()
      };
      
      const operation = this.editMode && this.currentTemoignage
        ? this.portfolioService.updateTemoignage(this.currentTemoignage.id, data)
        : this.portfolioService.addTemoignage(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Témoignage ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadTemoignages();
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
  
  deleteTemoignage(temoignage: Temoignage) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le témoignage de "${temoignage.auteur}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteTemoignage(temoignage.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Témoignage supprimé avec succès'
            });
            this.loadTemoignages();
          }
        });
      }
    });
  }
  
  onPhotoSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // TODO: Implémenter l'upload de photo
      console.log('Photo sélectionnée:', file);
    }
  }
  
  getStarsArray(rate: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rate ? 1 : 0);
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}