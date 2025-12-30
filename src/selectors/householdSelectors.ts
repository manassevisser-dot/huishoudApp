import { createSelector } from 'reselect';
import { FormState } from '../shared-types/form';
import { getHouseholdStatus } from '../logic/householdLogic';

/**
 * CONSTANTEN
 */
export const HOUSEHOLD_STATUS = {
  SINGLE: 'SINGLE',
  PARTNERS: 'PARTNERS',
  SPECIAL: 'SPECIAL',
} as const;

/**
 * BASE SELECTORS (Directe toegang tot de state)
 */
const selectMembers = (state: FormState) => state.data.household?.members || [];
const selectSetupData = (state: FormState) => state.data.setup || {};

/**
 * LOGIC SELECTORS
 */

// 1. Statistieken op basis van de setup (voorheen index ['setup'])
export const selectHouseholdStats = createSelector(
  [selectSetupData],
  (setupData) => {
    const adultCount = Number(setupData.aantalVolwassen || 0);
    return {
      adultCount,
      isSpecial: adultCount > 5,
    };
  }
);

// 2. Boolean check voor specifieke business rules (bijv. test WAI-003)
export const selectIsSpecialStatus = createSelector(
  [selectHouseholdStats],
  (stats) => stats.isSpecial
);

// 3. Status van data-integriteit (gebruikt de functie uit de Logic laag)
export const selectHouseholdDataIntegrityStatus = createSelector(
  [selectMembers],
  (members) => getHouseholdStatus(members)
);

/**
 * UI STATUS SELECTOR
 * Combineert de telling met de status-labels
 */
export const selectHouseholdTypeLabel = createSelector(
  [selectHouseholdStats],
  (stats) => {
    if (stats.isSpecial) return HOUSEHOLD_STATUS.SPECIAL;
    if (stats.adultCount === 2) return HOUSEHOLD_STATUS.PARTNERS;
    return HOUSEHOLD_STATUS.SINGLE;
  }
);