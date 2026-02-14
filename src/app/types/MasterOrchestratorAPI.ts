import type { IThemeOrchestrator } from '../orchestrators/interfaces/IThemeOrchestrator';
import type { IUIOrchestrator } from '../orchestrators/interfaces/IUIOrchestrator';

export interface MasterOrchestratorAPI {
  // Navigatie & Validatie
  canNavigateNext: (sectionId: string) => boolean;
  onNavigateNext: () => void;
  onNavigateBack(): void;
  isVisible: (ruleName: string, memberId?: string) => boolean;
  
  // De Sub-interfaces (facades)
  readonly ui: IUIOrchestrator; 
  readonly theme: IThemeOrchestrator;

  // Data & Side-effects
  updateField: (fieldId: string, value: unknown) => void;
  handleCsvImport: (csvText: string) => Promise<void>;
}