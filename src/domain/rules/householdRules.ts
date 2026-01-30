import { Member } from '@domain/household';

/**
 * PHOENIX LOGIC: Bepaalt de validiteit van het huishouden.
 * Een huishouden is 'complete' als elk lid (entityId) een naam en geboortedatum heeft.
 */
export const getHouseholdStatus = (members: Member[]): 'empty' | 'partial' | 'complete' => {
  if (!members || members.length === 0) return 'empty';

  const memberStatus = members.map((m) => {
    // Check of de minimale Phoenix-velden gevuld zijn
    const hasName = !!m.firstName && m.firstName.trim().length > 0;
    const hasDOB = !!m.dateOfBirth;

    return hasName && hasDOB;
  });

  const completeCount = memberStatus.filter((status) => status === true).length;

  if (completeCount === members.length) return 'complete';
  if (completeCount > 0) return 'partial';
  return 'empty';
};
// Nieuwe toevoeging aan householdRules.ts

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
  if (adultCount > 5) return HOUSEHOLD_CLASSIFICATION.SPECIAL;
  if (adultCount === 2) return HOUSEHOLD_CLASSIFICATION.PARTNERS;
  return HOUSEHOLD_CLASSIFICATION.SINGLE;
};

// src/domain/rules/householdRules.ts
export const isSpecialInvestigationRequired = (adultCount: number): boolean => adultCount > 5;