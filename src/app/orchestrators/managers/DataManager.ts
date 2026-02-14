// src/app/orchestrators/DataManager.ts

import type { FormState } from '@core/types/core';
import type { IDataOrchestrator, ImportResult } from '@app/orchestrators/interfaces/IDataOrchestrator';
import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import type { ResearchProcessor } from '@app/orchestrators/interfaces/IDataOrchestrator';


export class DataManager implements IDataOrchestrator {
  /**
   * De constructor accepteert nu elk object dat voldoet aan de ResearchProcessor interface.
   * Hierdoor 'kent' de DataManager de concrete ResearchOrchestrator klasse niet meer.
   */
  constructor(private readonly research: ResearchProcessor) {}

  public processCsvImport(params: {
    csvText: string;
    state: FormState;
  }): ImportResult {
    // We delegeren de aanroep naar de ImportOrchestrator.
    // Omdat this.research voldoet aan ResearchProcessor, is dit type-safe.
    return ImportOrchestrator.processCsvImport(this.research, {
      csvText: params.csvText,
      members: params.state.data.household.members,
      setupData: params.state.data.setup ?? null,
    });
  }
}