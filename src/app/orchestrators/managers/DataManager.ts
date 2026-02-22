// src/app/orchestrators/DataManager.ts
/**
 * @file_intent Implementeert de IDataOrchestrator interface en fungeert als de centrale coördinator voor complexe data-ingestie en transformatie-taken.
 * @repo_architecture Mobile Industry (MI) - Data Orchestration Management Layer.
 * @term_definition ResearchProcessor = De leidende logica-engine die bepaalt hoe ruwe data wordt geaggregeerd voor zowel de lokale app-state als onderzoeksdoeleinden. ImportOrchestrator = De uitvoerende component die de workflow van csv-parsing en mapping beheert.
 * @contract De DataManager fungeert als een Dependency Injection container voor data-operaties; het injecteert de ResearchProcessor in de ImportOrchestrator om consistentie tussen import-acties en onderzoeksstandaarden te garanderen.
 * @ai_instruction Deze klasse is het centrale aanspreekpunt voor data-imports vanuit de UI. Het onttrekt de complexiteit van de ResearchProcessor aan de aanroepende component, waardoor de UI enkel de csv-tekst en de actuele state hoeft aan te leveren om een gestructureerd ImportResult te ontvangen.
 */
// SCHETS/DataManager.ts (Volledig & Grefactord)
/**
 * @file_intent Implementeert de IDataOrchestrator interface en fungeert als de façade voor data-ingestie.
 * @repo_architecture Mobile Industry (MI) - Data Orchestration Management Layer.
 * @term_definition ImportOrchestrator = De uitvoerende component die het parsen en transformeren van CSV-bestanden uitvoert.
 * @contract Deze klasse dient als een stabiel toegangspunt voor de MasterOrchestrator om data-import taken aan te vragen. Het delegeert de uitvoering aan de onderliggende ImportOrchestrator.
 * @ai_instruction Deze manager moet 'dun' blijven. Het coördineert geen cross-domein logica, maar delegeert puur de ingestie-taak aan de juiste uitvoerende klasse.
 */
import type { FormState } from '@core/types/core';
// We importeren hier de nieuwe, lokale resultaat-interface.
import { LocalImportResult, ImportOrchestrator  } from '@app/orchestrators/ImportOrchestrator';


// De interface implementatie is nu simpeler.
export interface IDataOrchestrator {
  processCsvImport(params: { csvText: string; state: FormState }): LocalImportResult;
}

export class DataManager implements IDataOrchestrator {
  private importOrchestrator: ImportOrchestrator;

  // De `ResearchProcessor` afhankelijkheid is verwijderd uit de constructor.
  constructor() {
    // De DataManager is nu alleen verantwoordelijk voor het aanmaken van zijn EIGEN afhankelijkheden.
    this.importOrchestrator = new ImportOrchestrator();
  }

  /**
   * Delegeert de CSV-verwerking direct aan de ImportOrchestrator.
   * Deze methode geeft een `LocalImportResult` terug, zonder research data.
   */
  public processCsvImport(params: { csvText: string; state: FormState }): LocalImportResult {
    // De complexe aanroep is vervangen door een simpele delegatie.
    return this.importOrchestrator.processCsvImport({
      csvText: params.csvText,
      setupData: params.state.data.setup ?? null,
    });
  }
}
