import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { Experience } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class ExperiencesService extends PortfolioBaseService<Experience> {
  
  protected getStorageKey(): string {
    return 'experiences';
  }
  
  getExperiences(): Experience[] {
    return this.getItems();
  }
  
  addExperience(experience: Omit<Experience, 'id'>): Observable<Experience> {
    const newExperience: Experience = {
      ...experience,
      id: this.generateId()
    };
    return this.addItem(newExperience);
  }
  
  updateExperience(id: string, data: Partial<Experience>): Observable<Experience> {
    return this.updateItem(id, data);
  }
  
  deleteExperience(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }
  
  loadMockData(): void {
    const mockExperiences: Experience[] = [
      {
        id: '1',
        entreprise: 'TechCorp',
        poste: 'Développeur Full Stack Senior',
        description: 'Développement d\'applications web avec Angular et Node.js. Encadrement d\'une équipe de 3 développeurs juniors.',
        dateDebut: new Date('2022-01-01'),
        dateFin: undefined,
        lieu: 'Casablanca, Maroc',
        utilisateurId: '1'
      },
      {
        id: '2',
        entreprise: 'StartupInnovante',
        poste: 'Développeur Frontend',
        description: 'Création d\'interfaces utilisateur modernes et responsives avec Angular et TypeScript.',
        dateDebut: new Date('2020-06-01'),
        dateFin: new Date('2021-12-31'),
        lieu: 'Rabat, Maroc',
        utilisateurId: '1'
      }
    ];
    
    this.updateItems(() => mockExperiences);
  }
}