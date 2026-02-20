// src/app/orchestrators/interfaces/IThemeOrchestrator.ts
/**
 * @file_intent Definieert het contract voor het beheer van de visuele identiteit van de applicatie, inclusief persistentie en runtime updates.
 * @repo_architecture Mobile Industry (MI) - Presentation Orchestrator Layer.
 * @term_definition Theme = Een set van kleurspecificaties en stijltokens gedefinieerd in de domein-constants. onThemeChange = Een observer-patroon callback die zorgt dat de UI reactief mee-verandert bij een thema-wijziging.
 * @contract Verantwoordelijk voor de brug tussen persistente opslag (AsyncStorage) en de actieve UI-weergave. Garandeert dat thema-keuzes bewaard blijven tussen sessies en biedt een mechanisme voor real-time synchronisatie met React-state.
 * @ai_instruction Implementaties van deze interface moeten asynchrone I/O (loading/saving) afhandelen, maar een synchrone getter bieden voor performante UI-renders. Gebruik de onThemeChange methode in hooks om re-renders te triggeren.
 */
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