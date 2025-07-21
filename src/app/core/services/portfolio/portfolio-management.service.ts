import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioBaseService } from './portfolio-base.service';
import { Portfolio } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioManagementService extends PortfolioBaseService<Portfolio> {
  
  protected getStorageKey(): string {
    return 'portfolios';
  }
  
  getPortfolios(): Portfolio[] {
    return this.getItems();
  }
  
  createPortfolio(data: Omit<Portfolio, 'id' | 'dateCreation' | 'derniereModification' | 'vues'>): Observable<Portfolio> {
    const newPortfolio: Portfolio = {
      ...data,
      id: this.generateId(),
      dateCreation: new Date(),
      derniereModification: new Date(),
      vues: 0
    };
    return this.addItem(newPortfolio);
  }
  
  updatePortfolioStatus(portfolioId: string, statut: 'actif' | 'brouillon' | 'archive'): Observable<Portfolio> {
    return this.updateItem(portfolioId, { 
      statut, 
      derniereModification: new Date() 
    });
  }
  
  updatePortfolioVisibility(portfolioId: string, isPublic: boolean): Observable<Portfolio> {
    return this.updateItem(portfolioId, { 
      isPublic, 
      derniereModification: new Date() 
    });
  }
  
  deletePortfolio(portfolioId: string): Observable<boolean> {
    return this.deleteItem(portfolioId);
  }
  
  incrementViews(portfolioId: string): Observable<Portfolio> {
    const portfolio = this.getItems().find(p => p.id === portfolioId);
    if (portfolio) {
      return this.updateItem(portfolioId, { 
        vues: portfolio.vues + 1 
      });
    }
    throw new Error('Portfolio not found');
  }
  
  loadMockData(): void {
    const mockPortfolio: Portfolio = {
      id: '1',
      nom: 'Mon Portfolio Professionnel',
      url: 'quickfolio.com/p/elaanbari',
      template: 'Horizon moderne',
      statut: 'actif',
      dateCreation: new Date('2024-01-15'),
      derniereModification: new Date('2024-01-20'),
      vues: 1247,
      utilisateurId: '1',
      isPublic: true
    };
    
    this.updateItems(() => [mockPortfolio]);
  }
}