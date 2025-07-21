import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ConfirmDialogModule,
    DividerModule,
    TabViewModule
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {
  passwordForm: FormGroup;
  profileForm: FormGroup;
  currentUser: User | null = null;
  loading = false;
  activeIndex = 0;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
    
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nomUtilisateur: ['', [Validators.required]],
      titreProf: ['', [Validators.required]],
      adresse: ['', [Validators.required]]
    });
  }
  
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        nom: this.currentUser.nom,
        prenom: this.currentUser.prenom,
        email: this.currentUser.email,
        nomUtilisateur: this.currentUser.nomUtilisateur,
        titreProf: this.currentUser.titreProf,
        adresse: this.currentUser.adresse
      });
    }
  }
  
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  onUpdateProfile() {
    if (this.profileForm.valid) {
      this.loading = true;
      
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Profil mis à jour',
          detail: 'Vos informations ont été mises à jour avec succès'
        });
        this.loading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }
  
  onChangePassword() {
    if (this.passwordForm.valid) {
      this.loading = true;
      
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mot de passe modifié',
          detail: 'Votre mot de passe a été modifié avec succès'
        });
        this.passwordForm.reset();
        this.loading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }
  
  onDeactivateAccount() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir désactiver votre compte ? Votre compte sera suspendu pendant 30 jours, après quoi vous pourrez le réactiver en vous reconnectant.',
      header: 'Désactiver le compte',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, désactiver',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.deactivateAccount();
      }
    });
  }
  
  onDeleteAccount() {
    this.confirmationService.confirm({
      message: 'ATTENTION : Cette action est irréversible ! Toutes vos données (portfolio, projets, abonnement) seront définitivement supprimées. Êtes-vous absolument sûr ?',
      header: 'Supprimer définitivement le compte',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, supprimer définitivement',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAccount();
      }
    });
  }
  
  private deactivateAccount() {
    this.loading = true;
    
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Compte désactivé',
        detail: 'Votre compte a été désactivé. Vous pouvez le réactiver dans les 30 jours en vous reconnectant.'
      });
      
      setTimeout(() => {
        this.authService.logout();
        this.router.navigate(['/']);
      }, 2000);
    }, 1000);
  }
  
  private deleteAccount() {
    this.loading = true;
    
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Compte supprimé',
        detail: 'Votre compte et toutes vos données ont été définitivement supprimés.'
      });
      
      setTimeout(() => {
        this.authService.logout();
        this.router.navigate(['/']);
      }, 2000);
    }, 1000);
  }
  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
  
  // Helper methods for form validation
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}