import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { Competence } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class CompetencesService extends PortfolioBaseService<Competence> {
  
  protected getStorageKey(): string {
    return 'competences';
  }
  
  getCompetences(): Competence[] {
    return this.getItems();
  }
  
  addCompetence(competence: Omit<Competence, 'id'>): Observable<Competence> {
    const newCompetence: Competence = {
      ...competence,
      id: this.generateId()
    };
    return this.addItem(newCompetence);
  }
  
  updateCompetence(id: string, data: Partial<Competence>): Observable<Competence> {
    return this.updateItem(id, data);
  }
  
  deleteCompetence(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }
  
  loadMockData(): void {
    const mockCompetences: Competence[] = [
      {
        id: '1',
        nom: 'Angular',
        niveau: 85,
        typeCompetenceId: '1',
        utilisateurId: '1'
      },
      {
        id: '2',
        nom: 'TypeScript',
        niveau: 90,
        typeCompetenceId: '1',
        utilisateurId: '1'
      },
      {
        id: '3',
        nom: 'Communication',
        niveau: 75,
        typeCompetenceId: '2',
        utilisateurId: '1'
      }
    ];
    
    this.updateItems(() => mockCompetences);
  }
}