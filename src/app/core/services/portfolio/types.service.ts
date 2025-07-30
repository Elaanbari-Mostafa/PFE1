import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { TypeCompetence, TypeProjet } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class TypesService extends PortfolioBaseService<TypeCompetence | TypeProjet> {
  private typesCompetences = signal<TypeCompetence[]>([]);
  private typesProjets = signal<TypeProjet[]>([]);
  
  protected getStorageKey(): string {
    return 'types';
  }
  
  // Types de Compétences
  getTypesCompetences(): Observable<TypeCompetence[]> {
    return this.simulateApiCall(this.typesCompetences(), 200);
  }
  
  addTypeCompetence(type: Omit<TypeCompetence, 'id'>): Observable<TypeCompetence> {
    const newType: TypeCompetence = {
      ...type,
      id: this.generateId()
    };
    return this.simulateApiCall(newType).pipe(
      map(result => {
        this.typesCompetences.update(items => [...items, result]);
        return result;
      })
    );
  }
  
  updateTypeCompetence(id: string, data: Partial<TypeCompetence>): Observable<TypeCompetence> {
    return this.simulateApiCall(data as TypeCompetence).pipe(
      map(result => {
        this.typesCompetences.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return this.typesCompetences().find(t => t.id === id)!;
      })
    );
  }
  
  deleteTypeCompetence(id: string): Observable<boolean> {
    return this.simulateApiCall(true).pipe(
      map(() => {
        this.typesCompetences.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }
  
  // Types de Projets
  getTypesProjets(): Observable<TypeProjet[]> {
    return this.simulateApiCall(this.typesProjets(), 200);
  }
  
  addTypeProjet(type: Omit<TypeProjet, 'id'>): Observable<TypeProjet> {
    const newType: TypeProjet = {
      ...type,
      id: this.generateId()
    };
    return this.simulateApiCall(newType).pipe(
      map(result => {
        this.typesProjets.update(items => [...items, result]);
        return result;
      })
    );
  }
  
  updateTypeProjet(id: string, data: Partial<TypeProjet>): Observable<TypeProjet> {
    return this.simulateApiCall(data as TypeProjet).pipe(
      map(result => {
        this.typesProjets.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return this.typesProjets().find(t => t.id === id)!;
      })
    );
  }
  
  deleteTypeProjet(id: string): Observable<boolean> {
    return this.simulateApiCall(true).pipe(
      map(() => {
        this.typesProjets.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }
  
  loadMockData(): void {
    // Types de compétences par défaut
    const mockTypesCompetences: TypeCompetence[] = [
      { id: '1', nom: 'Technique', utilisateurId: '1' },
      { id: '2', nom: 'Soft Skills', utilisateurId: '1' },
      { id: '3', nom: 'Langues', utilisateurId: '1' }
    ];
    
    // Types de projets par défaut
    const mockTypesProjets: TypeProjet[] = [
      { id: '1', nom: 'Web', utilisateurId: '1' },
      { id: '2', nom: 'Mobile', utilisateurId: '1' },
      { id: '3', nom: 'Desktop', utilisateurId: '1' },
      { id: '4', nom: 'Design', utilisateurId: '1' }
    ];
    
    this.typesCompetences.set(mockTypesCompetences);
    this.typesProjets.set(mockTypesProjets);
  }
}