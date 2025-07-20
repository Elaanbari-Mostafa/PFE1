import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipsModule } from 'primeng/chips';
import { InputNumberModule } from 'primeng/inputnumber';
import { PortfolioService } from '../../../../../core/services/portfolio.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-informations-personnelles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CalendarModule,
    FileUploadModule,
    ChipsModule,
    InputNumberModule
  ],
  templateUrl: './informations-personnelles.component.html',
  styleUrls: ['./informations-personnelles.component.scss']
})
export class InformationsPersonnellesComponent implements OnInit {
  infoForm: FormGroup;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.infoForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      adresse: ['', Validators.required],
      dateNaissance: [''],
      nomUtilisateur: ['', Validators.required],
      titrePro: ['', Validators.required],
      surMoi: [''],
      nationalite: [''],
      pays: ['Maroc', Validators.required],
      ville: ['Casablanca', Validators.required],
      languages: [["Français", "Anglais", "Arabe"]],
      cvPath: [''],
      photoProfilPrimaryPath: [''],
      photoProfilSecondairePath: [''],
      projetsTermines: [8, [Validators.min(0)]],
      recompenses: [9, [Validators.min(0)]],
      clients: [0, [Validators.min(0)]],
      clientsSatisfaits: [8, [Validators.min(0)]],
      anneesExperience: [10, [Validators.min(0)]],
      description: ['']
    });
  }
  
  ngOnInit() {
    this.loadInformations();
  }
  
  loadInformations() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.infoForm.patchValue({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        adresse: user.adresse,
        

        nomUtilisateur: user.nomUtilisateur,
        titrePro: user.titreProf
      });
    }
    
    const infos = this.portfolioService.getInformationsPersonnelles();
    if (infos) {
      this.infoForm.patchValue(infos);
    }
  }
  
  onSubmit() {
    if (this.infoForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.infoForm.value,
        utilisateurId: user?.id || '1'
      };
      
      this.portfolioService.updateInformationsPersonnelles(data).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Informations sauvegardées avec succès'
          });
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
  
  onPhotoSelect(event: any, type: 'original' | 'secondaire') {
    const file = event.files[0];
    if (file) {
      // TODO: Implémenter l'upload de photo
      console.log(`Photo ${type} sélectionnée:`, file);
    }
  }

  onCVSelect(event:any){

  }
  
  // Helper methods for form validation
  get nom() { return this.infoForm.get('nom'); }
  get prenom() { return this.infoForm.get('prenom'); }
  get email() { return this.infoForm.get('email'); }
  get adresse() { return this.infoForm.get('adresse'); }
  get nomUtilisateur() { return this.infoForm.get('nomUtilisateur'); }
  get titrePro() { return this.infoForm.get('titrePro'); }
  get pays() { return this.infoForm.get('pays'); }
  get ville() { return this.infoForm.get('ville'); }
}