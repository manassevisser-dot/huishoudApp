// src/test-utils/factories/memberFactory.ts

import type { Member } from '@core/types/core';

/**
 * Maakt één member met defaults en optionele overrides.
 * FIX: 'age' is nu consistent met de type/leeftijd logica.
 */
export function makeMember(
  index = 1,
  type: 'adult' | 'child' | 'teenager' | 'senior' = 'adult',
  overrides?: Partial<Member>,
): Member {
  const id = `${type}-${index}`;
  
  // Logica voor realistische leeftijden op basis van type
  const getDefaultAge = () => {
    switch (type) {
      case 'child': return 5;
      case 'teenager': return 15;
      case 'senior': return 70;
      default: return 35;
    }
  };

  return {
    entityId: overrides?.entityId ?? id,
    fieldId: overrides?.fieldId ?? `member-${id}`,
    memberType: overrides?.memberType ?? type,
    firstName: overrides?.firstName ?? `${type}`,
    lastName: overrides?.lastName ?? `${index}`,
    gender: overrides?.gender,
    dateOfBirth: overrides?.dateOfBirth,
    // ✅ FIX: Leeftijd matcht nu met de categorie om validatiefouten te voorkomen
    age: overrides?.age ?? getDefaultAge(),
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
 * Maakt een Legacy member (oud) - UITSLUITEND VOOR MIGRATIETESTS.
 * Let op: we returnen 'any' omdat dit object bewust niet aan het Member-type voldoet.
 */
export function makeLegacyMember(): any {
  return {
    id: 'old-001',
    naam: 'Jan Janssen',
    type: 'puber',
    leeftijd: 16,
  };
}