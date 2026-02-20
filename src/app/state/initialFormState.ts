// src/app/state/initialFormState.ts
/**
 * @file_intent Definieert de baseline state-structuur voor de gehele applicatie bij initialisatie of na een harde reset.
 * @repo_architecture Mobile Industry (MI) - Core State Configuration.
 * @term_definition DATA_KEYS = Enum of constanten die de namespaces (setup, household, finance) binnen de data-store bewaken. schemaVersion = Versienummer gebruikt voor migraties van opgeslagen state.
 * @contract Dient als de blauwdruk voor de FormState interface. Garandeert dat alle verplichte velden, zoals gedefinieerd in @core/types/core, aanwezig zijn met veilige default-waarden om runtime undefined errors te voorkomen.
 * @ai_instruction Wijzigingen in het domeinmodel moeten hier worden doorgevoerd om te voorkomen dat de reducer of UI-componenten op ongeldige data-paden proberen te lezen. De property 'viewModels' is hier geïnitialiseerd als een leeg object ter voorbereiding op runtime-hydratatie door de orchestrators.
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
  },
  // FIX: Voeg de ontbrekende property toe om aan de FormState interface te voldoen
  viewModels: {
    // Als de linter hier klaagt over ontbrekende sub-properties, 
    // moeten we die hier ook met hun defaults neerzetten.
  },
  meta: {
    lastModified: new Date().toISOString(),
    version: 1,
  },
};