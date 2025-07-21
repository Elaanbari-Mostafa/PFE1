import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class PortfolioBaseService<T> {
  protected items = signal<T[]>([]);
  
  protected abstract getStorageKey(): string;
  
  getItems(): T[] {
    return this.items();
  }
  
  protected generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
  
  protected simulateApiCall<R>(data: R, delay_ms: number = 300): Observable<R> {
    return of(data).pipe(delay(delay_ms));
  }
  
  protected updateItems(updater: (items: T[]) => T[]): void {
    this.items.update(updater);
  }
  
  protected addItem(item: T): Observable<T> {
    return this.simulateApiCall(item).pipe(
      map(result => {
        this.updateItems(items => [...items, result]);
        return result;
      })
    );
  }
  
  protected updateItem(id: string, data: Partial<T>, idField: keyof T = 'id' as keyof T): Observable<T> {
    return this.simulateApiCall(data as T).pipe(
      map(result => {
        this.updateItems(items => 
          items.map(item => 
            item[idField] === id ? { ...item, ...result } : item
          )
        );
        return this.items().find(item => item[idField] === id)!;
      })
    );
  }
  
  protected deleteItem(id: string, idField: keyof T = 'id' as keyof T): Observable<boolean> {
    return this.simulateApiCall(true).pipe(
      map(() => {
        this.updateItems(items => items.filter(item => item[idField] !== id));
        return true;
      })
    );
  }
}