// src/app/state/initialFormState.ts
/**
 * @file_intent Definieert de baseline state-structuur voor de gehele applicatie bij initialisatie of na een harde reset.
 * @repo_architecture Mobile Industry (MI) - Core State Configuration.
 * @term_definition DATA_KEYS = Enum of constanten die de namespaces (setup, household, finance) binnen de data-store bewaken. schemaVersion = Versienummer gebruikt voor migraties van opgeslagen state.
 * @contract Dient als de blauwdruk voor de FormState interface. Garandeert dat alle verplichte velden, zoals gedefinieerd in @core/types/core, aanwezig zijn met veilige default-waarden om runtime undefined errors te voorkomen.
 * @ai_instruction Wijzigingen in het domeinmodel moeten hier worden doorgevoerd om te voorkomen dat de reducer of UI-componenten op ongeldige data-paden proberen te lezen. De property 'viewModels' is hier geïnitialiseerd als een leeg object ter voorbereiding op runtime-hydratatie door de orchestrators.
 * @changes [Fase 5] csvImport slice toegevoegd binnen data (niet op top-level).
 */

import type { FormState } from '@core/types/core';
import { DATA_KEYS } from '@domain/constants/datakeys';

export const initialFormState: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentScreenId: 'landing',
  isValid: true,
  data: {
    [DATA_KEYS.SETUP]: {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: 'Geen',
      heeftHuisdieren: false,
      woningType: 'Huur',
    },
    [DATA_KEYS.HOUSEHOLD]: {
      members: [],
      huurtoeslag: 0,
      zorgtoeslag: 0,
    },
    [DATA_KEYS.FINANCE]: {
      income: { items: [], totalAmount: 0 },
      expenses: { items: [], totalAmount: 0 },
    },
    latestTransaction: {
      latestTransactionDate: new Date().toISOString().split('T')[0],
      latestTransactionAmount: 0,
      latestTransactionCategory: null,
      latestTransactionDescription: '',
      latestPaymentMethod: 'pin',
    },
    // ─── CSV Import State ───────────────────────────────────────────────────
    // Leeg bij eerste start. Wordt gevuld door CsvUploadWorkflow (Fase 6).
    // CsvImportSchema is .optional() in FormStateSchema — undefined is ook geldig.
    csvImport: {
      transactions: [],
      importedAt: '',
      period: null,
      status: 'idle',
      sourceBank: undefined,
      fileName: '',
      transactionCount: 0,
    },
  },
  viewModels: {},
  meta: {
    lastModified: new Date().toISOString(),
    version: 1,
  },
};
