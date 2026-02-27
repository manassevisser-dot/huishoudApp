// src/app/orchestrators/managers/DataManager.ts
/**
 * @file_intent Implementeert de IDataOrchestrator interface en fungeert als de façade voor data-ingestie
 *   én als coördinator van de volledige CSV-import workflow.
 * @repo_architecture Mobile Industry (MI) - Data Orchestration Management Layer.
 * @term_definition
 *   ImportOrchestrator = De uitvoerende component die het parsen en transformeren van CSV uitvoert (ACL).
 *   executeImportWorkflow = De volledige orchestratie: parse → research → dispatch → log.
 * @contract
 *   processCsvImport() → bestaand, ongewijzigd, retourneert LocalImportResult (parsen only).
 *   executeImportWorkflow() → nieuw, coördineert de complete import-workflow inclusief research en dispatch.
 * @ai_instruction
 *   De ACL is geïmplementeerd in ImportOrchestrator (PII-stripping, date-normalisatie, hash-digest).
 *   De TODO in MasterOrchestrator over de ACL is hiermee achterhaald en verwijderd.
 *   ResearchOrchestrator en FormStateOrchestrator worden als params ontvangen (stateless aanpak).
 * @changes [Fase 5] Toegevoegd: executeImportWorkflow() — verplaatst uit MasterOrchestrator.handleCsvImport().
 *   Verwijderd: ACL TODO (ImportOrchestrator is al effectieve ACL, verified in OPEN_EINDJES.md).
 */
import type { FormState } from '@core/types/core';
import { LocalImportResult, ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import type { ResearchOrchestrator, MasterProcessResult } from '@app/orchestrators/ResearchOrchestrator';
import { DATA_KEYS } from '@domain/constants/datakeys';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { BusinessManager } from './BusinessManager';

export interface IDataOrchestrator {
  processCsvImport(params: { csvText: string; state: FormState }): LocalImportResult;
}

export class DataManager implements IDataOrchestrator {
  private importOrchestrator: ImportOrchestrator;

  constructor() {
    this.importOrchestrator = new ImportOrchestrator();
  }

  // ─── Bestaande methode (ongewijzigd) ─────────────────────────────

  public processCsvImport(params: { csvText: string; state: FormState }): LocalImportResult {
    return this.importOrchestrator.processCsvImport({
      csvText: params.csvText,
      setupData: params.state.data.setup ?? null,
    });
  }

  // ─── Nieuw: volledige import-workflow [Fase 5] ────────────────────
  /**
   * Coördineert de complete CSV-import workflow.
   * Verplaatst uit MasterOrchestrator.handleCsvImport().
   *
   * Stappen:
   *   1. Parse via ImportOrchestrator (ACL — PII-gestript, datum genormaliseerd)
   *   2. Verrijk via ResearchOrchestrator (privacy airlock, income reconciliation)
   *   3. Dispatch finance data naar state
   *   4. Herbereken business state
   *   5. Log resultaat
   *
   * @param csvText  - Ruwe CSV-tekst van de gebruiker.
   * @param fso      - Voor getState() en dispatch(); als param voor stateless aanpak.
   * @param research - ResearchOrchestrator voor verrijking en privacy-controle.
   * @param business - BusinessManager voor recompute na import.
   */
  public async executeImportWorkflow(
    csvText: string,
    fso: FormStateOrchestrator,
    research: ResearchOrchestrator,
    business: BusinessManager,
  ): Promise<void> {
    const state = fso.getState();

    // STAP 1: Parse via ImportOrchestrator (DataManager.processCsvImport = bestaande ACL)
    const localImportResult = this.processCsvImport({ csvText, state });

    if (localImportResult.status !== 'success') {
      if (localImportResult.status === 'error') {
        logger.error('csv_parse_failed', {
          orchestrator: 'data',
          action: 'executeImportWorkflow',
          error: localImportResult.errorMessage,
        });
      } else if (localImportResult.status === 'empty') {
        logger.warn('csv_parse_empty', {
          orchestrator: 'data',
          action: 'executeImportWorkflow',
          count: 0,
        });
      }
      return;
    }

    // STAP 2: Verrijk via ResearchOrchestrator
    const finalResult = research.processAllData(
      state.data.household.members,
      localImportResult.transactions,
      state.data.setup,
    );

    // STAP 3: Dispatch finance data
    this.dispatchImportData(fso, finalResult.local.finance);

    // STAP 4: Herbereken business state
    business.recompute(fso);

    // STAP 5: Log resultaat
    this.logImportCompletion(finalResult);
  }

  // ─── Private helpers ──────────────────────────────────────────────

  private dispatchImportData(
    fso: FormStateOrchestrator,
    financeData: MasterProcessResult['local']['finance'],
  ): void {
    fso.dispatch({
      type: 'UPDATE_DATA',
      payload: {
        [DATA_KEYS.FINANCE]: {
          income: { items: financeData.transactions.filter((tx) => tx.amount > 0) },
          expenses: { items: financeData.transactions.filter((tx) => tx.amount < 0) },
          hasMissingCosts: financeData.hasMissingCosts,
        },
      },
    });
  }

  private logImportCompletion(result: MasterProcessResult): void {
    const count = result.local.finance.transactions.length;
    logger.info('csv_import_success', {
      orchestrator: 'data',
      action: 'executeImportWorkflow',
      count,
    });
    if (result.local.finance.summary.isDiscrepancy === true) {
      logger.warn('csv_import_discrepancy_found', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        details: result.local.finance.summary,
      });
    }
  }
}
