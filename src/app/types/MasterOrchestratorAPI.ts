// src/app/types/MasterOrchestratorAPI.ts
/**
 * @file_intent Het formele contract tussen de Business/Application logic en de React UI.
 * @repo_architecture Mobile Industry (MI) - Interface Definition Layer.
 * @term_definition Facade Pattern = Een vereenvoudigde interface voor een complex subsysteem van orchestrators.
 * @contract Exclusiviteit. De UI mag uitsluitend communiceren met methoden die in deze interface zijn gedefinieerd.
 * @ai_instruction Bij consolidatie van orchestrators moet deze interface stabiel blijven om de UI-laag te beschermen tegen breaking changes.
 */
import type { IThemeOrchestrator } from '../orchestrators/interfaces/IThemeOrchestrator';
import type { IUIOrchestrator } from '../orchestrators/interfaces/IUIOrchestrator';
import type { INavigationOrchestrator } from '../orchestrators/interfaces/INavigationOrchestrator';

export interface MasterOrchestratorAPI {
  // Navigatie & Validatie
  canNavigateNext: (sectionId: string) => boolean;
  onNavigateNext: () => void;
  onNavigateBack(): void;
  isVisible: (ruleName: string, memberId?: string) => boolean;
  
  // De Sub-interfaces (facades)
  readonly ui: IUIOrchestrator; 
  readonly theme: IThemeOrchestrator;
  readonly navigation: INavigationOrchestrator;

  // Data & Side-effects
  updateField: (fieldId: string, value: unknown) => void;
  handleCsvImport: (csvText: string) => Promise<void>;
}