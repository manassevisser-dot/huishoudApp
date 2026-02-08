// src/app/orchestrators/DataManager.ts

import type { FormState } from '@core/types/core';
import type { IDataOrchestrator, ImportResult } from '@app/orchestrators/interfaces/IDataOrchestrator';
import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator.WIP';

export class DataManager implements IDataOrchestrator {
  constructor(private readonly research: ResearchOrchestrator) {}

  public processCsvImport(params: {
    csvText: string;
    state: FormState;
  }): ImportResult {
    // DataManager kent de state-shape; Master hoeft dat niet te weten
    return ImportOrchestrator.processCsvImport(this.research, {
      csvText: params.csvText,
      members: params.state.data.household.members,
      setupData: params.state.data.setup ?? null,
    });
  }
}
