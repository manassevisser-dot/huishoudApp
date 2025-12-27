/**
 * Project Phoenix: Household Domain
 * Bevat de regels voor de speciale status van huishoudens.
 */

export interface HouseholdStats {
  adultCount: number;
  childCount: number;
}

export const getHouseholdStatus = (stats: HouseholdStats): 'STANDARD' | 'SPECIAL_LARGE' => {
  // RULE [2024-12-07]: Huishoudens met [volwassenen > 5] krijgen een speciale status.
  if (stats.adultCount > 5) {
    return 'SPECIAL_LARGE';
  }
  return 'STANDARD';
};
