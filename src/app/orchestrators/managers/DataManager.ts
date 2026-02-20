// src/app/orchestrators/DataManager.ts
/**
 * @file_intent Implementeert de IDataOrchestrator interface en fungeert als de centrale coördinator voor complexe data-ingestie en transformatie-taken.
 * @repo_architecture Mobile Industry (MI) - Data Orchestration Management Layer.
 * @term_definition ResearchProcessor = De leidende logica-engine die bepaalt hoe ruwe data wordt geaggregeerd voor zowel de lokale app-state als onderzoeksdoeleinden. ImportOrchestrator = De uitvoerende component die de workflow van CSV-parsing en mapping beheert.
 * @contract De DataManager fungeert als een Dependency Injection container voor data-operaties; het injecteert de ResearchProcessor in de ImportOrchestrator om consistentie tussen import-acties en onderzoeksstandaarden te garanderen.
 * @ai_instruction Deze klasse is het centrale aanspreekpunt voor data-imports vanuit de UI. Het onttrekt de complexiteit van de ResearchProcessor aan de aanroepende component, waardoor de UI enkel de CSV-tekst en de actuele state hoeft aan te leveren om een gestructureerd ImportResult te ontvangen.
 */
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