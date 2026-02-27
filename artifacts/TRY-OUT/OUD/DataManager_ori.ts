// [ORIGINEEL — zie src/app/orchestrators/managers/DataManager.ts]
// Bewaard als referentie. Niet aanpassen.
import type { FormState } from '@core/types/core';
import { LocalImportResult, ImportOrchestrator  } from '@app/orchestrators/ImportOrchestrator';

export interface IDataOrchestrator {
  processCsvImport(params: { csvText: string; state: FormState }): LocalImportResult;
}

export class DataManager implements IDataOrchestrator {
  private importOrchestrator: ImportOrchestrator;

  constructor() {
    this.importOrchestrator = new ImportOrchestrator();
  }

  public processCsvImport(params: { csvText: string; state: FormState }): LocalImportResult {
    return this.importOrchestrator.processCsvImport({
      csvText: params.csvText,
      setupData: params.state.data.setup ?? null,
    });
  }
}
