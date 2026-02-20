// src/domain/rules/householdRules.ts
import { Member } from '@core/types/core';

const SPECIAL_THRESHOLD = 5;
const PARTNER_THRESHOLD = 2;

export function isHouseholdComplete(members: Member[]): boolean {
  // Fix error 1: Check expliciet op null/undefined en length
  if (members === null || members === undefined || members.length === 0) {
    return false;
  }

  return members
    .filter(m => m.entityId !== null && m.entityId !== undefined) // Fix error 2: Expliciete check
    .every(m => {
      // Fix error 3 & 4: Check expliciet of strings gevuld zijn
      const hasName = m.name !== null && m.name !== undefined && m.name !== '';
      const hasDob = m.dob !== null && m.dob !== undefined && m.dob !== '';
      return hasName && hasDob;
    });
}

export function getHouseholdStatus(members: Member[]): 'special' | 'partner' | 'default' {
  // Fix error 5: Expliciete check op members
  const count = (members !== null && members !== undefined) ? members.length : 0;

  if (count >= SPECIAL_THRESHOLD) {
    return 'special';
  }
  if (count === PARTNER_THRESHOLD) {
    return 'partner';
  }
  return 'default';
}

export function isSpecialInvestigationRequired(count: number): number {
  if (count >= SPECIAL_THRESHOLD) {
    return count;
  }
  
  return 0;
}