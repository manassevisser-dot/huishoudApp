// src/app/orchestrators/interfaces/IDataOrchestrator.ts
/**
 * @file_intent Definieert de contracten voor dataverwerking en import-orchestratie, specifiek gericht op het transformeren van externe CSV-data naar bruikbare applicatie- en onderzoeksmodellen.
 * @repo_architecture Mobile Industry (MI) - Data Processing Interface Layer.
 * @term_definition ResearchProcessor = De logische engine die ledenlijsten, CSV-data en setup-data aggregeert. ImportResult = Een discriminated union die expliciet de status (success, empty, error) en de bijbehorende payload van een importoperatie afdwingt.
 * @contract IDataOrchestrator dient als de poortwachter voor data-import. Het garandeert dat de UI altijd een voorspelbaar resultaat-object terugkrijgt, inclusief foutmeldingen of lege states, zonder direct de globale state te muteren.
 * @ai_instruction Bij het toevoegen van nieuwe importbronnen moeten de ImportResult sub-types (zoals ImportSuccess) worden uitgebreid. Let op de strikte scheiding tussen 'local' data (voor de app-werking) en 'research' data (voor analytics).
 */

import type { FormState, Member } from '@core/types/core';
import type { CsvItem, FinancialIncomeSummary } from '@core/types/research';

/**
 * Centraal contract voor de processor die de ruwe data omzet.
 * Wordt gebruikt door zowel de DataManager als de ImportOrchestrator.
 */
export interface ResearchProcessor {
  processAllData(
    members: Member[],
    csvText: string,
    setupData: Record<string, unknown> | null
  ): {
    local: {
      finance: {
        transactions: CsvItem[];
        summary: FinancialIncomeSummary;
        hasMissingCosts: boolean;
      };
    };
    research: Record<string, unknown>;
  };
}

// --- Nieuwe, correcte ImportResult-definitie ---
type ImportSuccess = {
  status: 'success';
  transactions: CsvItem[];
  count: number;
  summary: FinancialIncomeSummary;
  hasMissingCosts?: boolean;
  researchData?: Record<string, unknown>;
};

type ImportEmpty = {
  status: 'empty';
  transactions: [];
  count: 0;
  summary: FinancialIncomeSummary;
  hasMissingCosts?: boolean;
  researchData?: Record<string, unknown>; // optioneel, maar consistent
};

type ImportError = {
  status: 'error';
  transactions: [];
  count: 0;
  errorMessage: string;
  summary: FinancialIncomeSummary;
  hasMissingCosts?: boolean;
  researchData?: Record<string, unknown>;
};


export type ImportResult = ImportSuccess | ImportEmpty | ImportError;

export type ImportStatusValue = 'success' | 'empty' | 'error';

export interface IDataOrchestrator {
  processCsvImport(params: {
    csvText: string;
    state: FormState;
  }): ImportResult;
}