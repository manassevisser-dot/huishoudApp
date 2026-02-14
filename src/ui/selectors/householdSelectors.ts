import { createSelector } from 'reselect';
import { FormState } from '@core/types/core';

// We extraheren het type direct uit de FormState interface 
// zodat we niet naar 'domain' hoeven te verwijzen.
type SetupData = FormState['data']['setup'];

const selectSetupData = (state: FormState): SetupData | Record<string, never> => {
  const setup = state.data?.setup;
  
  if (setup !== null && setup !== undefined) {
    return setup;
  }
  
  return {};
};

export const selectHouseholdStats = createSelector(
  [selectSetupData], 
  (setup) => {
    // 'setup' is nu automatisch getypeerd via de FormState
    const aantal = setup?.aantalVolwassen;
    const cleanAdultCount = (aantal !== null && aantal !== undefined) ? aantal : 0;
    
    return {
      adultCount: Number(cleanAdultCount),
    };
  }
);