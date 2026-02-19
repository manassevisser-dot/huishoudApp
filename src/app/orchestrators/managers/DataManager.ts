// src/app/orchestrators/DataManager.ts

import type { FormState } from '@core/types/core';
import type { IDataOrchestrator, ImportResult, ResearchProcessor } from '@app/orchestrators/interfaces/IDataOrchestrator';
import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';

export class DataManager implements IDataOrchestrator {
  private importOrchestrator: ImportOrchestrator;

  // De ResearchProcessor is LEIDEND en komt binnen via de constructor
  constructor(private research: ResearchProcessor) {
    this.importOrchestrator = new ImportOrchestrator();
  }

  public processCsvImport(params: { csvText: string; state: FormState }): ImportResult {
    // We geven de 'research' engine door aan de orchestrator die de CSV verwerkt
    return this.importOrchestrator.processCsvImport(this.research, {
      csvText: params.csvText,
      members: params.state.data.household.members,
      setupData: params.state.data.setup ?? null,
    });
  }
}