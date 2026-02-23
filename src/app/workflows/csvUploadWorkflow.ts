// src/app/workflows/csvUploadWorkflow.ts
/**
 * @file_intent Orkestreert de 3-fasen CSV import: Parse → Analyse → Research.
 * @repo_architecture Mobile Industry (MI) - Application Layer / Workflows.
 * @term_definition ImportPhase = 'parse' | 'analyze' | 'research' — trackt workflow-voortgang.
 * @contract Gebruikt FormStateOrchestrator.dispatch voor state-updates; muteert geen state direct.
 * @ai_instruction ACL zit in ImportOrchestrator — vertrouw op parseResult.transactions.
 *                 CSV-data overschrijft NOOIT wizard-data; alleen aanvullen/verifiëren.
 * @changes [Fase 6]
 *   CsvUploadParams NIET meer geïmporteerd uit MasterOrchestratorAPI:
 *     Reden: circulaire dep — MasterOrchestratorAPI → MasterOrchestrator → hier.
 *     Oplossing: lokale CsvWorkflowInput met dezelfde velden (DutchBank uit csvUpload.types).
 *   toDispatchSlice() vervangen door expliciete .map() op transactions (TS 2322 fix).
 *   Partial<CsvImportState> dispatch: lees huidige state + merge status (reducer eist volledig object).
 *   runPhaseC: buildWarnings() geëxtraheerd zodat runPhaseC < 30 regels.
 */

import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import type { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import type { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
import type { BusinessManager } from '@app/orchestrators/managers/BusinessManager';
import type {
  ImportResult,
  ParsedCsvTransaction,
  CsvImportStateSlice,
  CsvAnalysisResult,
  CsvImportWarning,
  DutchBank,
} from '@app/orchestrators/types/csvUpload.types';
import { CsvAnalysisService } from '@domain/finance/CsvAnalysisService';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { FormAction } from '@app/state/formReducer';

// ─── Lokaal input type ────────────────────────────────────────────────────────
// CsvUploadParams NIET geïmporteerd uit MasterOrchestratorAPI — circulaire dep.
// (MasterOrchestratorAPI → MasterOrchestrator → CsvUploadWorkflow → terug)
// Structureel identiek aan CsvUploadParams, maar lokaal gedeclareerd.

interface CsvWorkflowInput {
  csvText: string;
  fileName: string;
  bank?: DutchBank;
}

// ─── Dependency bundel ────────────────────────────────────────────────────────

interface CsvUploadWorkflowDeps {
  fso: FormStateOrchestrator;
  importOrch: ImportOrchestrator;
  research: ResearchOrchestrator;
  business: BusinessManager;
}

// ─── Interne helpers ──────────────────────────────────────────────────────────

function detectPeriod(
  transactions: ParsedCsvTransaction[],
): { from: string; to: string } | null {
  const dates = transactions.map((tx) => tx.date).filter((d) => d !== '');
  if (dates.length === 0) return null;
  return {
    from: dates.reduce((a, b) => (a < b ? a : b)),
    to: dates.reduce((a, b) => (a > b ? a : b)),
  };
}

/**
 * Converteert CsvImportStateSlice naar het FSO-dispatch payload type.
 * Het Zod-schema (formStateSchema) gebruikt Record<string,unknown> voor 'original'.
 * ParsedCsvTransaction.original is CsvOriginalMetadata (concreet, geen index-sig).
 * Expliciete .map() zodat TypeScript het resultaat correct typt — geen cast nodig.
 */
function toDispatchPayload(slice: CsvImportStateSlice): Extract<FormAction, { type: 'UPDATE_CSV_IMPORT' }>['payload'] {
  const mappedTransactions = slice.transactions.map((tx) => ({
    ...tx,
    original: tx.original as unknown as Record<string, unknown>,
  }));
  return { ...slice, transactions: mappedTransactions } as Extract<FormAction, { type: 'UPDATE_CSV_IMPORT' }>['payload'];
}

/** Bouwt warnings array op basis van analyse-resultaat. */
function buildWarnings(analysis: CsvAnalysisResult): CsvImportWarning[] {
  const warnings: CsvImportWarning[] = [];

  if (analysis.isDiscrepancy) {
    warnings.push({
      type: 'ambiguous',
      message: analysis.discrepancyDetails ?? 'Inkomensverschil gedetecteerd',
    });
  }

  if (analysis.hasMissingCosts) {
    warnings.push({
      type: 'unmatched',
      message: 'Woonlasten gevonden die niet verwacht werden',
    });
  }

  return warnings;
}

// ─── Workflow ─────────────────────────────────────────────────────────────────

export class CsvUploadWorkflow {
  private readonly fso: FormStateOrchestrator;
  private readonly importOrch: ImportOrchestrator;
  private readonly research: ResearchOrchestrator;
  private readonly business: BusinessManager;

  constructor(deps: CsvUploadWorkflowDeps) {
    this.fso = deps.fso;
    this.importOrch = deps.importOrch;
    this.research = deps.research;
    this.business = deps.business;
  }

  public async execute(params: CsvWorkflowInput): Promise<ImportResult> {
    try {
      const parseOutcome = this.runPhaseA(params);
      if (parseOutcome.outcome === 'failure') return parseOutcome;

      const analysisResult = this.runPhaseB(parseOutcome.transactions, params);
      return this.runPhaseC(parseOutcome.transactions, analysisResult, params);
    } catch (error) {
      logger.error('csv_workflow_failed', {
        workflow: 'csvUpload',
        error: error instanceof Error ? error.message : String(error),
      });
      return { outcome: 'failure', errorMessage: 'Onverwachte fout tijdens import' };
    }
  }

  // ─── Fase A: Parse ──────────────────────────────────────────────────────────

  private runPhaseA(
    params: CsvWorkflowInput,
  ): { outcome: 'failure'; errorMessage: string } | { outcome: 'ok'; transactions: ParsedCsvTransaction[] } {
    const parseResult = this.importOrch.processCsvImport(params.csvText);

    if (parseResult.status === 'empty') {
      logger.warn('csv_parse_empty', { workflow: 'csvUpload', fileName: params.fileName });
      return { outcome: 'failure', errorMessage: 'Geen transacties gevonden in het bestand' };
    }

    if (parseResult.status === 'error') {
      logger.error('csv_parse_error', { workflow: 'csvUpload', error: parseResult.errorMessage });
      return { outcome: 'failure', errorMessage: parseResult.errorMessage };
    }

    const { transactions } = parseResult;
    const slice: CsvImportStateSlice = {
      transactions,
      importedAt: new Date().toISOString(),
      period: detectPeriod(transactions),
      status: 'parsed',
      sourceBank: params.bank,
      fileName: params.fileName,
      transactionCount: transactions.length,
    };

    this.fso.dispatch({ type: 'UPDATE_CSV_IMPORT', payload: toDispatchPayload(slice) });
    return { outcome: 'ok', transactions };
  }

  // ─── Fase B: Analyse ────────────────────────────────────────────────────────

  private runPhaseB(
    transactions: ParsedCsvTransaction[],
    params: CsvWorkflowInput,
  ): CsvAnalysisResult {
    const state = this.fso.getState();
    const analysis = CsvAnalysisService.analyse(transactions, state.data.setup, state.data.finance);

    this.fso.dispatch({ type: 'UPDATE_VIEWMODEL', payload: { csvAnalysis: analysis } });

    // Status bijwerken: lees huidige slice en merge — reducer eist volledig object
    const current = state.data.csvImport;
    if (current !== undefined) {
      this.fso.dispatch({ type: 'UPDATE_CSV_IMPORT', payload: { ...current, status: 'analyzed' } });
    }

    if (analysis.isDiscrepancy) {
      logger.warn('csv_discrepancy_found', {
        workflow: 'csvUpload',
        fileName: params.fileName,
        diff: analysis.setupComparison?.diffCents,
      });
    }
    if (analysis.hasMissingCosts) {
      logger.warn('csv_missing_costs_detected', { workflow: 'csvUpload' });
    }

    return analysis;
  }

  // ─── Fase C: Research + afsluiting ─────────────────────────────────────────

  private runPhaseC(
    transactions: ParsedCsvTransaction[],
    analysis: CsvAnalysisResult,
    params: CsvWorkflowInput,
  ): ImportResult {
    const state = this.fso.getState();

    // Gereserveerd voor Fase 7 (anonymized insights) — resultaat nog niet gebruikt.
    void this.research.processAllData(
      state.data.household.members,
      transactions as unknown as Parameters<typeof this.research.processAllData>[1],
      state.data.setup,
    );

    this.business.recompute(this.fso);

    logger.info('csv_import_completed', {
      workflow: 'csvUpload',
      fileName: params.fileName,
      transactionCount: transactions.length,
      hasDiscrepancy: analysis.isDiscrepancy,
    });

    const warnings = buildWarnings(analysis);

    if (warnings.length > 0) {
      return { outcome: 'partial', processedCount: transactions.length, skippedCount: 0, warnings, summary: analysis };
    }
    return { outcome: 'success', processedCount: transactions.length, summary: analysis };
  }
}
