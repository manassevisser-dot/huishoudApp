import type { Member } from '@core/types/core';
import { VisibilityContext } from './fieldVisibility';

/**
 * ADR-06: Defensive Programming
 * Filterregels voor dynamische formulieronderdelen.
 */

// We definiëren wat we verwachten in de context voor deze specifieke regel
type HouseholdData = { members: Member[] };

export const dataFilterRules = {
  member_income_repeater: (ctx: VisibilityContext): Member[] => {
    // We halen de waarde op en vertellen TS dat dit HouseholdData moet zijn
    // De 'as un_known' is hier een veilige brug van de algemene context naar dit specifieke type
    const household = ctx.getValue('household') as unknown as HouseholdData | undefined;

    // Als household bestaat en members een array is, geven we die terug
    if (household !== undefined && household !== null && Array.isArray(household.members)) {
      return household.members;
    }

    return [];
  },
};