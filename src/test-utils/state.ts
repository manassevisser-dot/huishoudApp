
// Phoenix-proof FormState helper
import { FormState } from '@shared-types/form';

/* Phoenix-proof FormState helper
 * Staat toe om slechts een deel van de state (of data) mee te geven.
 */
export function makePhoenixState(
  partial?: Partial<Omit<FormState, 'data'>> & { 
    data?: Partial<FormState['data']> 
  }
): FormState {
  // 1) Base state met alle verplichte velden volgens het Phoenix-model
  const base: FormState = {
    activeStep: 'LANDING',
    currentPageId: 'setupHousehold',
    isValid: false,
    data: {
      setup: {},
      household: { members: [] },
      finance: { income: { items: [] }, expenses: { items: [] } },
    },
  };

  // 2) Merge de data-velden zorgvuldig
  // We zorgen dat de defaults van 'base.data' behouden blijven als ze niet in 'partial.data' zitten
  const mergedData = {
    ...base.data,
    ...(partial?.data ?? {}),
  };

  // 3) Retourneer het volledige object
  return {
    ...base,
    ...partial,
    data: mergedData,
  } as FormState;
}

