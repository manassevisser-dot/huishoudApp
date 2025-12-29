import { DATA_KEYS } from '@domain/constants/datakeys';
import { FormState } from '@shared-types/form';

export const HOUSEHOLD_STATUS = {
  SINGLE: 'SINGLE',
  PARTNERS: 'PARTNERS',
  SPECIAL: 'SPECIAL',
};

/**
 * Berekent de statistieken van het huishouden.
 */
export const selectHouseholdStats = (state: FormState) => {
  const setupData = state[DATA_KEYS.SETUP] || {};
  const adultCount = Number(setupData.aantalVolwassen || 0); // Gebruik 0 als fallback voor lege state

  return {
    adultCount,
    // Deze boolean wordt gebruikt voor de test-check
    isSpecial: adultCount > 5,
  };
};

/**
 * FIX: Deze moet 'true' of 'false' teruggeven voor de test WAI-003.
 * De status string ("SINGLE"/"SPECIAL") kun je beter in een aparte selector zetten.
 */
export const selectIsSpecialStatus = (state: FormState): boolean => {
  const { adultCount } = selectHouseholdStats(state);
  return adultCount > 5;
};

/**
 * Nieuwe selector voor de UI-status (de string-versie)
 */
export const selectHouseholdStatusType = (state: FormState) => {
  const { adultCount } = selectHouseholdStats(state);
  if (adultCount > 5) return HOUSEHOLD_STATUS.SPECIAL;
  if (adultCount === 2) return HOUSEHOLD_STATUS.PARTNERS;
  return HOUSEHOLD_STATUS.SINGLE;
};