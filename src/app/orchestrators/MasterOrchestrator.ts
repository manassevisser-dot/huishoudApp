// src/app/orchestrators/MasterOrchestrator.ts

import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { IUIOrchestrator } from './interfaces/IUIOrchestrator';
import type { ImportResult, IDataOrchestrator } from './interfaces/IDataOrchestrator';
import type { IBusinessOrchestrator } from './interfaces/IBusinessOrchestrator';
import type { IValidationOrchestrator, SectionValidationResult } from './interfaces/IValidationOrchestrator';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { logger } from '@adapters/audit/AuditLoggerAdapter';



type DomainCluster = { data: IDataOrchestrator; business: IBusinessOrchestrator; validation: IValidationOrchestrator };
type AppCluster = { ui: IUIOrchestrator; navigation: INavigationOrchestrator };

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
export class MasterOrchestrator {
  public readonly ui: IUIOrchestrator;

  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly domain: DomainCluster,
    private readonly app: AppCluster,
  ) {
    // Houd de façade naar buiten toe gelijk:
    this.ui = this.app.ui;
  }

  /* ───────────────────────── UI façade ───────────────────────── */

  public isVisible(ruleName: string, memberId?: string): boolean {
    return this.ui.isVisible(ruleName, memberId);
  }
  public validateSection(sectionId: string): SectionValidationResult {
    const state = this.fso.getState();
    return this.domain.validation.validateSection(sectionId, state.data);
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

    const result: ImportResult = await this.domain.data.processCsvImport({
      csvText,
      state,
    });

    this.fso.updateField('transactions', result.transactions);
    this.recomputeBusinessState();

    if (result.summary.isDiscrepancy === true) {
      logger.warn('import.discrepancy_found', { details: result.summary });
    } else {
      logger.info('import.success', { count: result.transactions.length });
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