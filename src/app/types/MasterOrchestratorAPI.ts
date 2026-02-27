// src/app/types/MasterOrchestratorAPI.ts
/**
 * Publiek contract tussen de applicatielogica en de React UI.
 *
 * @module app/types
 * @see {@link ../orchestrators/README.md | Orchestrators — Details}
 *
 * @remarks
 * De UI communiceert **uitsluitend** via methoden in `MasterOrchestratorAPI`.
 * `MasterOrchestrator` implementeert dit contract — consumers importeren nooit de concrete klasse.
 */
import type { IThemeOrchestrator } from '@app/orchestrators/interfaces/IThemeOrchestrator';
import type { IUIOrchestrator } from '@app/orchestrators/interfaces/IUIOrchestrator';
import type { INavigationOrchestrator } from '@app/orchestrators/interfaces/INavigationOrchestrator';
import type { RenderScreenVM } from '@app/orchestrators/MasterOrchestrator';
import type { DutchBank } from '@app/orchestrators/types/csvUpload.types';

/**
 * Parameters voor een CSV-import operatie, opgebouwd door `CsvUploadContainer` na `pickAndReadCsvFile()`.
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

  /**
   * Voert een reset uit zonder bevestigingsdialoog — bevestiging is UI-verantwoordelijkheid
   * (ResetConfirmationContainer via Alert.alert).
   *
   * @param type 'full'  → RESET_APP + PersistenceAdapter.clear() → navigeert naar LANDING.
   * @param type 'setup' → RESET_SETUP → navigeert naar WIZARD_SETUP_HOUSEHOLD.
   */
  executeReset: (type: 'full' | 'setup') => void;
}
