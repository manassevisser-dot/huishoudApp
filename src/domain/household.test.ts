// src/domain/__tests__/household.test.ts
/**
 * @test_intent Valideer getHouseholdStatus tegen het werkelijke status-vocabulaire.
 * Implementatie retourneert: 'special' (≥5), 'partner' (≥2), 'default' (0-1).
 */
import { ResearchMember } from '@core/types/research';
import { getHouseholdStatus } from '@domain/rules/householdRules';

const createMembers = (count: number, type: 'adult' | 'child'): ResearchMember[] =>
  Array.from({ length: count }).map((_, i) => ({
    entityId: `m-${i}`,
    fieldId: `field-household-member-${i}`,
    memberType: type,
    firstName: 'Test Lid',
    lastName: '',
    dateOfBirth: '1990-01-01',
  }));

describe('Household Logic: Status Determination', () => {
  it('moet "partner" teruggeven voor 2 adults (PARTNER_THRESHOLD)', () => {
    const members = createMembers(2, 'adult');
    expect(getHouseholdStatus(members)).toBe('partner');
  });

  it('moet "special" teruggeven voor ≥5 adults (SPECIAL_THRESHOLD)', () => {
    const members = createMembers(5, 'adult');
    expect(getHouseholdStatus(members)).toBe('special');
  });

  it('moet "special" teruggeven voor 6 adults (boven drempel)', () => {
    const members = createMembers(6, 'adult');
    expect(getHouseholdStatus(members)).toBe('special');
  });

  it('moet "partner" teruggeven bij gemengde samenstelling van ≥2 leden', () => {
    // 1 adult + 2 children = 3 leden totaal → partner (count >= PARTNER_THRESHOLD)
    const adults = createMembers(1, 'adult');
    const children = createMembers(2, 'child');
    expect(getHouseholdStatus([...adults, ...children])).toBe('partner');
  });

  it('moet "default" teruggeven bij 1 lid', () => {
    const members = createMembers(1, 'adult');
    expect(getHouseholdStatus(members)).toBe('default');
  });

  it('moet "default" teruggeven bij lege lijst', () => {
    // count = 0 < PARTNER_THRESHOLD → default
    expect(getHouseholdStatus([])).toBe('default');
  });
});
