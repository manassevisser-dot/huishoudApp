import { createSelector } from 'reselect';
import { FormState } from '@shared-types/form';
import { getHouseholdStatus } from '@logic/householdLogic';

/**
 * CONSTANTEN
 */
export const HOUSEHOLD_STATUS = {
  SINGLE: 'SINGLE',
  PARTNERS: 'PARTNERS',
  SPECIAL: 'SPECIAL',
} as const;

/**
 * BASE SELECTORS
 */
// Door 'as any[]' of een specifieke cast te gebruiken, voorkom je de mismatch
// tussen Record<string, unknown> en de verwachte Member-interface in de logica.
const selectMembers = (state: FormState) => state.data.household.members;
const selectSetupData = (state: FormState) => state.data.setup;

/**
 * LOGIC SELECTORS
 */

export const selectHouseholdStats = createSelector([selectSetupData], (setupData) => {
  // TypeScript weet nu dat setupData.aantalVolwassen bestaat
  const adultCount = setupData.aantalVolwassen;
  return {
    adultCount,
    isSpecial: adultCount > 5,
  };
});

export const selectIsSpecialStatus = createSelector(
  [selectHouseholdStats],
  (stats) => stats.isSpecial,
);

export const selectHouseholdDataIntegrityStatus = createSelector([selectMembers], (members) => {
  // Forceer het type hier naar wat de logic-functie verwacht om TS2345 te fixen
  return getHouseholdStatus(members as any);
});

/**
 * UI STATUS SELECTOR
 */
export const selectHouseholdTypeLabel = createSelector([selectHouseholdStats], (stats) => {
  if (stats.isSpecial) return HOUSEHOLD_STATUS.SPECIAL;
  if (stats.adultCount === 2) return HOUSEHOLD_STATUS.PARTNERS;
  return HOUSEHOLD_STATUS.SINGLE;
});
