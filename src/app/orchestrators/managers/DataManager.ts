// src/app/orchestrators/managers/DataManager.ts
/**
 * @file_intent Implementeert de IDataOrchestrator interface en fungeert als de façade voor data-ingestie
 *   én als coördinator van de volledige CSV-import workflow.
 */
import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import type { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { BusinessManager } from './BusinessManager';
import type { CsvParseResult, CsvParseSuccess, DutchBank } from '@app/orchestrators/types/csvUpload.types';

// Lokale params — CsvUploadParams niet geïmporteerd uit MasterOrchestratorAPI (circulaire dep)
interface CsvImportInput {
  csvText: string;
  fileName: string;
  bank?: DutchBank;
}

interface ImportWorkflowDeps {
  fso: FormStateOrchestrator;
  research: ResearchOrchestrator;
  business: BusinessManager;
}

export class DataManager {
  private readonly importOrchestrator: ImportOrchestrator;

  constructor() {
    this.importOrchestrator = new ImportOrchestrator();
  }

  public async executeImportWorkflow(
    params: CsvImportInput,
    deps: ImportWorkflowDeps,
  ): Promise<void> {
    const parseResult = this.importOrchestrator.processCsvImport(params.csvText);

    if (!this.handleParseResult(parseResult, params.fileName)) return;

    // Stub: recompute na parse zodat de app niet in een inconsistente staat blijft.
    deps.business.recompute(deps.fso);

    logger.info('csv_parse_success_stub', {
      orchestrator: 'data',
      action: 'executeImportWorkflow',
      count: parseResult.transactions.length,
      fileName: params.fileName,
      bank: params.bank,
    });
  }

  private handleParseResult(
    result: CsvParseResult,
    fileName: string
  ): result is CsvParseSuccess {
    if (result.status === 'error') {
      logger.error('csv_parse_failed', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        error: result.errorMessage,
      });
      return false;
    }

    if (result.status === 'empty') {
      logger.warn('csv_parse_empty', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        fileName,
      });
      return false;
    }

    return true;
  }
}