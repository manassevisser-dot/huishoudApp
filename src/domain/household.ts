/**
 * Project Phoenix: Household Domain Kernel
 */

export interface HouseholdStats {
  adultCount: number;
  childCount: number;
}

export interface Member {
  id: string;
  memberType: 'adult' | 'child';
  naam?: string;
  leeftijd?: number;
}

/**
 * RULE [2024-12-07]: Bepaal de status op basis van volwassenen.
 */
export const getHouseholdStatus = (stats: HouseholdStats): 'STANDARD' | 'SPECIAL_LARGE' => {
  if (stats.adultCount > 5) {
    return 'SPECIAL_LARGE';
  }
  return 'STANDARD';
};

/**
 * LOGIC [SYNC]: Houdt de ledenlijst in sync met het opgegeven aantal.
 * Verplaatst uit de FormContext/Goudmijn naar hier.
 */
export const syncMembers = (currentMembers: Member[], targetCount: number): Member[] => {
  const members = [...currentMembers];
  
  if (members.length < targetCount) {
    // Toevoegen
    const diff = targetCount - members.length;
    const newEntries = Array(diff).fill(null).map((_, i) => ({
      id: `temp-${Date.now()}-${members.length + i}`,
      memberType: 'adult' as const, // Default type
      naam: ''
    }));
    return [...members, ...newEntries];
  } else if (members.length > targetCount) {
    // Verwijderen (laatste eerst)
    return members.slice(0, targetCount);
  }
  
  return members;
};