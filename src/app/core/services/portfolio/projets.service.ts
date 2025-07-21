import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { Projet } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetsService extends PortfolioBaseService<Projet> {
  
  protected getStorageKey(): string {
    return 'projets';
  }
  
  getProjets(): Projet[] {
    return this.getItems();
  }
  
  addProjet(projet: Omit<Projet, 'id'>): Observable<Projet> {
    const newProjet: Projet = {
      ...projet,
      id: this.generateId()
    };
    return this.addItem(newProjet);
  }
  
  updateProjet(id: string, data: Partial<Projet>): Observable<Projet> {
    return this.updateItem(id, data);
  }
  
  deleteProjet(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }
  
  loadMockData(): void {
    const mockProjets: Projet[] = [
      {
        id: '1',
        titre: 'Application E-commerce',
        description: 'Développement d\'une plateforme e-commerce complète avec Angular et Node.js',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Express'],
        lienDemo: 'https://demo-ecommerce.com',
        projetImage: '',
        typeProjetId: '1',
        utilisateurId: '1'
      },
      {
        id: '2',
        titre: 'Application Mobile',
        description: 'Application mobile de gestion de tâches avec React Native',
        technologies: ['React Native', 'Firebase', 'Redux'],
        lienDemo: 'https://demo-mobile.com',
        projetImage: '',
        typeProjetId: '2',
        utilisateurId: '1'
      }
    ];
    
    this.updateItems(() => mockProjets);
  }
}