import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

export interface Theme {
  id: string;
  nom: string;
  description: string;
  preview: string;
  active: boolean;
  premium: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes = signal<Theme[]>([]);
  private activeTheme = signal<Theme | null>(null);

  constructor() {
    // Initialisation des thèmes par défaut
    this.themes.set([
      {
        id: 'modern',
        nom: 'Horizon moderne',
        description: 'Design moderne et épuré',
        preview: '../../../assets/images/temp1.png',
        active: true,
        premium: false
      },
      {
        id: 'creative',
        nom: 'Barre latérale créative',
        description: 'Pour les créatifs et designers',
        preview: '../../../assets/images/temp2.png',
        active: false,
        premium: true
      },
    ]);
  }

  getThemes(): Observable<Theme[]> {
    return of(this.themes()).pipe(delay(200));
  }

  getActiveTheme(): Theme | null {
    return this.activeTheme();
  }

  setActiveTheme(themeId: string): Observable<Theme> {
    return this.getThemes().pipe(
      map(themes => {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
          this.activeTheme.set(theme);
          return theme;
        }
        throw new Error('Theme not found');
      }),
      delay(300)
    );
  }

  customizeTheme(themeId: string, customizations: any): Observable<Theme> {
    return of({
      id: themeId + '_custom',
      nom: 'Theme Personnalisé',
      description: 'Theme personnalisé par l\'utilisateur',
      preview: '',
      active: true,
      premium: false
    }).pipe(delay(500));
  }
}