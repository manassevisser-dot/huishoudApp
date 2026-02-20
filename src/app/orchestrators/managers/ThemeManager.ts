// src/app/orchestrators/managers/ThemeManager.ts
/**
 * @file_intent Implementeert de IThemeOrchestrator om de visuele weergave-instellingen te synchroniseren tussen persistente opslag en de actieve UI.
 * @repo_architecture Mobile Industry (MI) - Presentation Management Layer.
 * @term_definition _listener = Een interne referentie naar een UI-callback die re-renders triggert bij thema-wijzigingen. storageShim = De abstractielaag voor I/O operaties (zoals AsyncStorage of LocalStorage).
 * @contract Beheert de stateful overgang tussen 'light' en 'dark' modi. Garandeert dat thema-wijzigingen atomair worden opgeslagen en direct worden gepropageerd naar geabonneerde componenten via het observer-patroon.
 * @ai_instruction De klasse gebruikt een interne cache (_currentTheme) om synchrone toegang via getTheme() mogelijk te maken, wat essentieel is voor performance in React renders. De loadTheme() methode moet idealiter tijdens de applicatie-bootstrap aangeroepen worden.
 */

import { loadTheme, saveTheme } from '@services/storageShim';
import type { Theme } from '@domain/constants/Colors';
import type { IThemeOrchestrator } from '@app/orchestrators/interfaces/IThemeOrchestrator';

export class ThemeManager implements IThemeOrchestrator {
  private _currentTheme: 'light' | 'dark' = 'light';
  private _listener?: (theme: Theme) => void;

  /**
   * Laadt het thema van schijf en update de interne cache.
   */
  public async loadTheme(): Promise<Theme> {
    const saved = await loadTheme();
    this._currentTheme = (saved !== null && saved !== undefined) ? saved : 'light';
    return this._currentTheme;
  }

  /**
   * Slaat op, update de cache en informeert de listener (de UI).
   */
  public async setTheme(theme: Theme): Promise<void> {
    this._currentTheme = theme;
    await saveTheme(theme);
    
    if (this._listener !== null && this._listener !== undefined) {
      this._listener(theme);
    }
  }

  /**
   * Geeft de laatst bekende waarde terug zonder async vertraging.
   */
  public getTheme(): Theme {
    return this._currentTheme;
  }

  /**
   * Verbindt de orchestrator met de React-wereld.
   */
  public onThemeChange(callback: (theme: Theme) => void): void {
    this._listener = callback;
  }
}