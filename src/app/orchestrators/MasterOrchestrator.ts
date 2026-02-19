// src/app/orchestrators/MasterOrchestrator.ts
/**
 * @file_intent De centrale hub en facade voor alle applicatie-acties.
 * @repo_architecture Mobile Industry (MI) - Orchestration Layer (The Hub).
 * @term_definition DomainCluster = Logica-diensten (Data, Business, Validatie). AppCluster = Presentatie-diensten (UI, Navigatie).
 * @contract Stateless coördinatie. Mag GEEN directe domeinlogica bevatten. Werkt uitsluitend met interfaces (Dependency Inversion).
 * @ai_instruction Dit is het enige object dat de FormStateOrchestrator (FSO) direct mag aansturen voor mutaties.
 */

import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { IUIOrchestrator } from './interfaces/IUIOrchestrator';
import type { ImportResult, IDataOrchestrator } from './interfaces/IDataOrchestrator';
import type { IBusinessOrchestrator } from './interfaces/IBusinessOrchestrator';
import type { IValidationOrchestrator, SectionValidationResult } from './interfaces/IValidationOrchestrator';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { IThemeOrchestrator } from './interfaces/IThemeOrchestrator';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';

interface IVisibilityEvaluator {
  evaluate(ruleName: string, memberId?: string): boolean;
}

type DomainCluster = { 
  data: IDataOrchestrator; 
  business: IBusinessOrchestrator; 
  validation: IValidationOrchestrator;
  visibility: IVisibilityEvaluator;
};


type AppCluster = { 
  ui: IUIOrchestrator; 
  navigation: INavigationOrchestrator; 
  theme: IThemeOrchestrator; 
};
/**
 * MASTER ORCHESTRATOR
 *
 * Verantwoordelijkheden:
 * - levenscyclus & compositie
 * - grensvalidatie
 * - state-mutaties
 * - side-effect-coördinatie
 *
 * Doet GEEN domeinlogica.
 * Kent GEEN concrete orchestrators.
 */
export class MasterOrchestrator implements MasterOrchestratorAPI {
  public readonly ui: IUIOrchestrator;
  public readonly theme: IThemeOrchestrator;
  public readonly navigation: INavigationOrchestrator;

  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly domain: DomainCluster,
    private readonly app: AppCluster,
  ) {
    // Houd de façade naar buiten toe gelijk:
    this.ui = this.app.ui;
    this.theme = this.app.theme;
    this.navigation = this.app.navigation;
  }

  /* ───────────────────────── UI façade ───────────────────────── */

  public isVisible(ruleName: string, memberId?: string): boolean {
    return this.domain.visibility.evaluate(ruleName, memberId);
  }
  private validateSection(sectionId: string): SectionValidationResult {
    const state = this.fso.getState();
    return this.domain.validation.validateSection(sectionId, state.data);
  }
  public onNavigateBack(): void {
    this.app.navigation.navigateBack();
  }
  public canNavigateNext(sectionId: string): boolean {
    const result = this.validateSection(sectionId);
    return result.isValid;
  }
  /**
   * UI meldt de intentie om naar de volgende pagina te gaan.
   * De intelligentie in de NavigationOrchestrator beslist of dit daadwerkelijk gebeurt.
   */
  public onNavigateNext(): void {
    this.app.navigation.navigateNext();
  }

 
  /* ─────────────────────── State boundary ────────────────────── */

  public updateField(fieldId: string, value: unknown): void {
    const result = validateAtBoundary(fieldId, value);

    if (!result.success) {
      logger.warn(result.error, { fieldId, value });
      return;
    }

    this.fso.updateField(fieldId, result.data);
    this.recomputeBusinessState();
  }

  /* ─────────────────────── Import workflow ───────────────────── */

  public async handleCsvImport(csvText: string): Promise<void> {
    const state = this.fso.getState();
    const result: ImportResult = await this.domain.data.processCsvImport({ csvText, state });
  
    switch (result.status) {
      case 'success':
        logger.info('CSV_IMPORT_SUCCESS', { count: result.count });
        this.fso.updateField('transactions', result.transactions);
        
        // Expliciete check voor ESLint (strict-boolean-expressions)
        if (result.researchData !== undefined) {
          this.fso.updateField('researchPayload', result.researchData);
        }
        break;
        
      case 'empty':
        logger.warn('CSV_IMPORT_EMPTY', { count: result.count });
        break;
        
      case 'error':
        logger.error('CSV_IMPORT_FAILED', { error: result.errorMessage });
        return; // Hierdoor weet TS: alles hieronder is GEEN error.
    }
  
    this.recomputeBusinessState();
  
    // Geen status-check meer nodig: TS weet dat we hier alleen komen bij success/empty
    if (result.summary.isDiscrepancy === true) {
      logger.warn('CSV_IMPORT_DISCREPANCY_FOUND', { details: result.summary });
    }
  }

  /* ─────────────────────── Private helpers ────────────────────── */

  private recomputeBusinessState(): void {
    const summary = this.domain.business.prepareFinancialViewModel(
      this.fso.getState(),
    );

    this.fso.dispatch({
      type: 'UPDATE_VIEWMODEL',
      payload: { financialSummary: summary },
    });
  }
}