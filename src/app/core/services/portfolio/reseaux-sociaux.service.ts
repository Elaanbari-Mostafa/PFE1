import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { ReseauSocial } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class ReseauxSociauxService extends PortfolioBaseService<ReseauSocial> {
  
  protected getStorageKey(): string {
    return 'reseaux-sociaux';
  }
  
  getReseauxSociaux(): ReseauSocial[] {
    return this.getItems();
  }
  
  addReseauSocial(reseau: Omit<ReseauSocial, 'id'>): Observable<ReseauSocial> {
    const newReseau: ReseauSocial = {
      ...reseau,
      id: this.generateId()
    };
    return this.addItem(newReseau);
  }
  
  updateReseauSocial(id: string, data: Partial<ReseauSocial>): Observable<ReseauSocial> {
    return this.updateItem(id, data);
  }
  
  deleteReseauSocial(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }
  
  loadMockData(): void {
    const mockReseaux: ReseauSocial[] = [
      {
        id: '1',
        nom: 'LinkedIn',
        url: 'https://linkedin.com/in/mostafa-elaanbari',
        icone: 'pi pi-linkedin',
        utilisateurId: '1'
      },
      {
        id: '2',
        nom: 'GitHub',
        url: 'https://github.com/mostafa-elaanbari',
        icone: 'pi pi-github',
        utilisateurId: '1'
      },
      {
        id: '3',
        nom: 'Portfolio',
        url: 'https://mostafa-portfolio.com',
        icone: 'pi pi-globe',
        utilisateurId: '1'
      }
    ];
    
    this.updateItems(() => mockReseaux);
  }
}