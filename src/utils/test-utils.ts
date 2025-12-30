import { DATA_KEYS } from '@domain/constants/datakeys';
import { FormState } from '../shared-types/form';

/**
 * ADR-11/16: Dynamische Mock Factory.
 * Voorkomt dat tests omvallen bij wijzigingen in verplichte velden.
 */
export const createMockState = (overrides: Partial<FormState> = {}) => {
  const baseState = {
    schemaVersion: '1.0',
    isSpecialStatus: false,
    [DATA_KEYS.SETUP]: { 
      aantalMensen: 1, 
      aantalVolwassen: 1 
    },
    [DATA_KEYS.HOUSEHOLD]: { 
      leden: [], 
      woning: 'Huur' 
    },
    [DATA_KEYS.FINANCE]: {
      inkomsten: {},
      householdBenefits: {},
      vermogen: { hasVermogen: false }
    },
    [DATA_KEYS.EXPENSES]: {
      wonen: { bedrag: 0 },
      vervoer: [],
      abonnementen: {}
    }
  };

  return { ...baseState, ...overrides };
};