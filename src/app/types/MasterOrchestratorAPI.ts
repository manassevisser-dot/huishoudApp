// src/app/types/MasterOrchestratorAPI.ts
/**
 * @file_intent Het formele contract tussen de Business/Application logic en de React UI.
 * @repo_architecture Mobile Industry (MI) - Interface Definition Layer.
 * @term_definition Facade Pattern = Een vereenvoudigde interface voor een complex subsysteem van orchestrators.
 * @contract Exclusiviteit. De UI mag uitsluitend communiceren met methoden die in deze interface zijn gedefinieerd.
 * @ai_instruction Bij consolidatie van orchestrators moet deze interface stabiel blijven om de UI-laag te beschermen tegen breaking changes.
 * @changes [Fase 3+8] handleCsvImport(csvText: string) → handleCsvImport(params: CsvUploadParams).
 *   CsvUploadParams toegevoegd als geëxporteerd type zodat CsvUploadContainer het kan importeren.
 */
import type { IThemeOrchestrator } from '@app/orchestrators/interfaces/IThemeOrchestrator';
import type { IUIOrchestrator } from '@app/orchestrators/interfaces/IUIOrchestrator';
import type { INavigationOrchestrator } from '@app/orchestrators/interfaces/INavigationOrchestrator';
import type { RenderScreenVM } from '@app/orchestrators/MasterOrchestrator';
import type { DutchBank } from '@app/orchestrators/types/csvUpload.types';

/**
 * Parameters voor een CSV-import operatie.
 * Wordt opgebouwd door CsvUploadContainer na pickAndReadCsvFile().
 */
export interface CsvUploadParams {
  /** Volledige CSV-tekst in UTF-8 */
  csvText: string;

  /** Originele bestandsnaam voor opslag in CsvImportStateSlice */
  fileName: string;

  /**
   * Bank-hint voor betere kolomdetectie in ImportOrchestrator.
   * Automatisch gedetecteerd door BankFormatDetector, of undefined.
   */
  bank?: DutchBank;
}

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

  /**
   * Start de volledige CSV-import workflow (parse → analyse → research).
   * Aangeroepen door CsvUploadContainer na pickAndReadCsvFile().
   *
   * @param params - CSV-tekst, bestandsnaam en optionele bank-hint.
   */
  handleCsvImport: (params: CsvUploadParams) => Promise<void>;

  saveDailyTransaction: () => boolean;
  buildRenderScreen: (screenId: string) => RenderScreenVM;
}
