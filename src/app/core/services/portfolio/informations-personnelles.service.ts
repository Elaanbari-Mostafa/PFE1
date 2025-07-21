import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { InformationPersonnelle } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class InformationsPersonnellesService extends PortfolioBaseService<InformationPersonnelle> {
  private informationsPersonnelles = signal<InformationPersonnelle | null>(null);
  
  protected getStorageKey(): string {
    return 'informations-personnelles';
  }
  
  getInformationsPersonnelles(): InformationPersonnelle | null {
    return this.informationsPersonnelles();
  }
  
  updateInformationsPersonnelles(data: Partial<InformationPersonnelle>): Observable<InformationPersonnelle> {
    const result = data as InformationPersonnelle;
    return this.simulateApiCall(result, 500).pipe(
      map(response => {
        this.informationsPersonnelles.set(response);
        return response;
      })
    );
  }
  
  loadInformationsPersonnelles(utilisateurId: string): Observable<InformationPersonnelle | null> {
    // Simulation de chargement depuis l'API
    const mockData: InformationPersonnelle = {
      id: '1',
      nom: 'EL AANBARI',
      prenom: 'Mostafa',
      email: 'm.elaanbari@email.com',
      telephone: '+212 610 853 494',
      adresse: 'Casablanca, Maroc',
      dateNaissance: new Date('1995-05-15'),
      nomUtilisateur: 'elaanbari',
      titrePro: 'Développeur Full Stack',
      descPro: 'Passionné par le développement web moderne et les technologies innovantes',
      nationalite: 'Marocaine',
      pays: 'Maroc',
      ville: 'Casablanca',
      languages: ['Français', 'Anglais', 'Arabe'],
      photoProfilOriginalePath: '',
      photoProfilSecondairePath: '',
      projetsTermines: 25,
      recompenses: 5,
      clientsSatisfaits: 18,
      anneesExperience: 5,
      description: 'Développeur passionné avec 5 ans d\'expérience dans le développement d\'applications web modernes.',
      utilisateurId: utilisateurId
    };
    
    return this.simulateApiCall(mockData, 200).pipe(
      map(data => {
        this.informationsPersonnelles.set(data);
        return data;
      })
    );
  }
}