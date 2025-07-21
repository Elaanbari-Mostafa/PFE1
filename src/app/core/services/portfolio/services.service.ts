import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { Service } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesPortfolioService extends PortfolioBaseService<Service> {
  
  protected getStorageKey(): string {
    return 'services';
  }
  
  getServices(): Service[] {
    return this.getItems();
  }
  
  addService(service: Omit<Service, 'id'>): Observable<Service> {
    const newService: Service = {
      ...service,
      id: this.generateId()
    };
    return this.addItem(newService);
  }
  
  updateService(id: string, data: Partial<Service>): Observable<Service> {
    return this.updateItem(id, data);
  }
  
  deleteService(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }
  
  loadMockData(): void {
    const mockServices: Service[] = [
      {
        id: '1',
        nom: 'Développement Web',
        description: 'Création d\'applications web modernes avec Angular, React ou Vue.js. Interface responsive et optimisée pour tous les appareils.',
        icone: 'pi pi-code',
        utilisateurId: '1'
      },
      {
        id: '2',
        nom: 'Développement Mobile',
        description: 'Applications mobiles natives et hybrides pour iOS et Android. Expérience utilisateur optimisée et performances élevées.',
        icone: 'pi pi-mobile',
        utilisateurId: '1'
      },
      {
        id: '3',
        nom: 'Consulting Technique',
        description: 'Conseil en architecture logicielle, choix technologiques et optimisation des performances. Audit de code et recommandations.',
        icone: 'pi pi-briefcase',
        utilisateurId: '1'
      }
    ];
    
    this.updateItems(() => mockServices);
  }
}