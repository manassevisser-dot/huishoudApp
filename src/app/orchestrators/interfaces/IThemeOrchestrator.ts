// src/app/orchestrators/interfaces/IThemeOrchestrator.ts
import type { Theme } from '@domain/constants/Colors';

export interface IThemeOrchestrator {
  /**
   * Initialiseert het thema vanuit de opslag (AsyncStorage).
   */
  loadTheme(): Promise<Theme>;

  /**
   * Werkt het thema bij in de opslag en triggert de actuele wijziging.
   */
  setTheme(theme: Theme): Promise<void>;

  /**
   * Geeft de laatst bekende waarde terug (synchroon).
   */
  getTheme(): Theme;

  /**
   * Registreert een callback die wordt aangeroepen zodra het thema wijzigt.
   * Cruciaal voor de koppeling met de React-state (materialisatie).
   */
  onThemeChange(callback: (theme: Theme) => void): void;
}