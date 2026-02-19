// src/app/state/initialFormState.ts
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