// src/app/orchestrators/managers/ThemeManager.ts

import { loadTheme, saveTheme } from '@services/storageShim';
import type { Theme } from '@domain/constants/Colors';
import type { IThemeOrchestrator } from '../interfaces/IThemeOrchestrator';

export class ThemeManager implements IThemeOrchestrator {
  private _currentTheme: Theme = 'light';
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