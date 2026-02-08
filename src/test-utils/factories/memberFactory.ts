// src/test-utils/factories/memberFactory.ts

import type { Member } from '@core/types/core';

/**
 * Maakt één member met defaults en optionele overrides.
 */
export function makeMember(
  index = 1,
  type: 'adult' | 'child' | 'teenager' | 'senior' = 'adult',
  overrides?: Partial<Member>,
): Member {
  const id = `${type}-${index}`;
  return {
    entityId: overrides?.entityId ?? id,
    fieldId: overrides?.fieldId ?? `member-${id}`,
    memberType: overrides?.memberType ?? type,
    firstName: overrides?.firstName ?? `${type}`,
    lastName: overrides?.lastName ?? `${index}`,
    gender: overrides?.gender,
    dateOfBirth: overrides?.dateOfBirth,
    // ✅ Voeg age toe aan de factory om TS2353 te voorkomen
    age: overrides?.age ?? (type === 'adult' ? 35 : 10),
  };
}

/**
 * Maakt een lijst members van één type.
 */
export function makeMembers(
  count: number,
  type: 'adult' | 'child' | 'teenager' | 'senior' = 'adult',
): Member[] {
  return Array.from({ length: count }, (_, i) => makeMember(i + 1, type));
}

/**
 * Maakt een gemengd huishouden (volwassenen + kinderen).
 */
export function makeMixedHousehold(adults = 2, children = 0): Member[] {
  return [...makeMembers(adults, 'adult'), ...makeMembers(children, 'child')];
}

/**
 * Maakt een Legacy member (oud) - deze simuleert de data van vóór de refactor.
 * Let op: we returnen 'any' omdat dit object bewust niet aan het Member-type voldoet.
 */
export function makeLegacyMember(): any {
  return {
    id: 'old-001',
    naam: 'Jan Janssen', // Wordt door privacyHelper gesplitst
    type: 'puber', // Wordt door privacyHelper 'teenager'
    leeftijd: 16, // Wordt door privacyHelper 'age'
  };
}
