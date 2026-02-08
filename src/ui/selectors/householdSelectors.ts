import { createSelector } from 'reselect';
import { FormState } from '@core/types/core';

const selectSetupData = (state: FormState): unknown => {
  const setup = state.data?.setup;
  // We checken expliciet voor ESLint
  if (setup !== null && setup !== undefined) {
    return setup;
  }
  // We gebruiken een lege string of object als unknown fallback
  return {};
};

export const selectHouseholdStats = createSelector(
  [selectSetupData], 
  (setup) => {
    // We casten 'setup' naar een object met optionele velden zodat TS niet klaagt
    // Dit is veiliger dan any, want we definiëren wat we verwachten
    const data = setup as { aantalVolwassen?: string | number } | null | undefined;
    
    const aantal = data?.aantalVolwassen;
    const cleanAdultCount = (aantal !== null && aantal !== undefined) ? aantal : 0;
    
    return {
      adultCount: Number(cleanAdultCount),
    };
  }
);