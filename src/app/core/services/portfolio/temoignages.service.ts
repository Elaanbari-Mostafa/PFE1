import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { Temoignage } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class TemoignagesService extends PortfolioBaseService<Temoignage> {
  
  protected getStorageKey(): string {
    return 'temoignages';
  }
  
  getTemoignages(): Temoignage[] {
    return this.getItems();
  }
  
  addTemoignage(temoignage: Omit<Temoignage, 'id'>): Observable<Temoignage> {
    const newTemoignage: Temoignage = {
      ...temoignage,
      id: this.generateId(),
      dateCreation: new Date()
    };
    return this.addItem(newTemoignage);
  }
  
  updateTemoignage(id: string, data: Partial<Temoignage>): Observable<Temoignage> {
    return this.updateItem(id, data);
  }
  
  deleteTemoignage(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }
  
  loadMockData(): void {
    const mockTemoignages: Temoignage[] = [
      {
        id: '1',
        auteur: 'Sarah Johnson',
        poste: 'Chef de Projet',
        entreprise: 'TechSolutions',
        contenu: 'Mostafa a livré un travail exceptionnel sur notre projet. Son expertise technique et sa capacité à respecter les délais sont remarquables.',
        rate: 5,
        photo: '',
        dateCreation: new Date('2024-01-15'),
        utilisateurId: '1'
      },
      {
        id: '2',
        auteur: 'Ahmed Benali',
        poste: 'Directeur Technique',
        entreprise: 'InnovCorp',
        contenu: 'Collaboration excellente avec Mostafa. Il a su comprendre nos besoins et proposer des solutions innovantes.',
        rate: 5,
        photo: '',
        dateCreation: new Date('2024-02-10'),
        utilisateurId: '1'
      }
    ];
    
    this.updateItems(() => mockTemoignages);
  }
}