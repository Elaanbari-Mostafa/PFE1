import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { Education } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class EducationsService extends PortfolioBaseService<Education> {
  
  protected getStorageKey(): string {
    return 'educations';
  }
  
  getEducations(): Education[] {
    return this.getItems();
  }
  
  addEducation(education: Omit<Education, 'id'>): Observable<Education> {
    const newEducation: Education = {
      ...education,
      id: this.generateId()
    };
    return this.addItem(newEducation);
  }
  
  updateEducation(id: string, data: Partial<Education>): Observable<Education> {
    return this.updateItem(id, data);
  }
  
  deleteEducation(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }
  
  loadMockData(): void {
    const mockEducations: Education[] = [
      {
        id: '1',
        institution: 'École Nationale Supérieure d\'Informatique',
        diplome: 'Master en Génie Logiciel',
        lieu: 'Rabat, Maroc',
        dateDebut: new Date('2018-09-01'),
        dateFin: new Date('2020-07-01'),
        description: 'Spécialisation en développement web et mobile, architecture logicielle et gestion de projets.',
        utilisateurId: '1'
      },
      {
        id: '2',
        institution: 'Université Hassan II',
        diplome: 'Licence en Informatique',
        lieu: 'Casablanca, Maroc',
        dateDebut: new Date('2015-09-01'),
        dateFin: new Date('2018-07-01'),
        description: 'Formation en programmation, bases de données et systèmes d\'information.',
        utilisateurId: '1'
      }
    ];
    
    this.updateItems(() => mockEducations);
  }
}