import { createSelector } from 'reselect';
import { FormState } from '@shared-types/form';

const selectSetupData = (state: FormState) => state.data?.setup || {};

export const selectHouseholdStats = createSelector(
  [selectSetupData], 
  (setup) => ({
    // We geven alleen de ruwe data door. Geen imports uit @domain!
    adultCount: Number(setup.aantalVolwassen || 0),
  })
);