import { FormStateSchema } from '@adapters/validation/formStateSchema';
import type { FormState } from '@adapters/validation/formStateSchema';

/**
 * INITIAL FORM STATE TEMPLATE
 * * Gebruikt het gecentraliseerde FormStateSchema om een valide 
 * startpunt voor de wizard te garanderen.
 */
export const INITIAL_FORM_STATE: FormState = {
  schemaVersion: '1.0',
  activeStep: 'setup',
  currentScreenId: 'setup_intro',
  isValid: false,
  data: {
    setup: {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: '0',
      woningType: 'Huur',
    },
    household: {
      members: [],
    },
    finance: {
      income: {
        totalAmount: 0,
      },
      expenses: {
        totalAmount: 0,
      },
    },
  },
  meta: {
    lastModified: new Date().toISOString(),
    version: 1,
  },
};

/**
 * Valideert de template tegen het schema om drift te voorkomen
 */
FormStateSchema.parse(INITIAL_FORM_STATE);