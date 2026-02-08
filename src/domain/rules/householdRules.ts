// src/domain/rules/householdRules.ts
import { Member } from '@core/types/core';

// Fix: no-magic-numbers
const SPECIAL_THRESHOLD = 5;
const PARTNER_THRESHOLD = 2;

/**
 * PHOENIX LOGIC: Bepaalt de validiteit van het huishouden.
 * Een huishouden is 'complete' als elk lid (entityId) een naam en geboortedatum heeft.
 */
export const getHouseholdStatus = (members: Member[]): 'empty' | 'partial' | 'complete' => {
  // Fix: strict-boolean-expressions (members is typed as array, so explicit length check only)
  if (members.length === 0) return 'empty';

  const memberStatus = members.map((m) => {
    // Check of de minimale Phoenix-velden gevuld zijn
    // Fix: strict-boolean-expressions (explicit checks instead of !!)
    const hasName = typeof m.firstName === 'string' && m.firstName.trim().length > 0;
    const hasDOB = m.dateOfBirth !== undefined && m.dateOfBirth !== null;

    return hasName && hasDOB;
  });

  const completeCount = memberStatus.filter((status) => status === true).length;

  if (completeCount === members.length) return 'complete';
  if (completeCount > 0) return 'partial';
  return 'empty';
};

export const HOUSEHOLD_CLASSIFICATION = {
  SINGLE: 'SINGLE',
  PARTNERS: 'PARTNERS',
  SPECIAL: 'SPECIAL',
} as const;

export type HouseholdType = keyof typeof HOUSEHOLD_CLASSIFICATION;

/**
 * Bepaalt het type huishouden op basis van aantal volwassenen (ADR-11)
 */
export const classifyHouseholdType = (adultCount: number): HouseholdType => {
  // Fix: no-magic-numbers
  if (adultCount > SPECIAL_THRESHOLD) return HOUSEHOLD_CLASSIFICATION.SPECIAL;
  if (adultCount === PARTNER_THRESHOLD) return HOUSEHOLD_CLASSIFICATION.PARTNERS;
  return HOUSEHOLD_CLASSIFICATION.SINGLE;
};

export const isSpecialInvestigationRequired = (adultCount: number): boolean => 
  adultCount > SPECIAL_THRESHOLD;