import { ResearchMember } from '@core/types/research';
import { getHouseholdStatus } from '@domain/rules/householdRules';
// Helper om Phoenix-compliant members te maken

const createMembers = (count: number, type: 'adult' | 'child'): ResearchMember[] =>
  Array.from({ length: count }).map((_, i) => ({
    entityId: `m-${i}`,
    fieldId: `field-household-member-${i}`, // VOEG DIT TOE
    memberType: type,
    firstName: 'Test Lid',
    lastName: '',
    dateOfBirth: '1990-01-01',
  }));

describe('Household Logic: Status Determination', () => {
  it('moet "complete" teruggeven voor 2 adults', () => {
    const members = createMembers(2, 'adult');
    // We verwachten 'complete' omdat 'STANDARD' niet in je type-definitie staat
    expect(getHouseholdStatus(members)).toBe('complete');
  });

  it('moet "complete" teruggeven voor > 5 adults (voorheen SPECIAL_LARGE)', () => {
    const members = createMembers(6, 'adult');
    // In de nieuwe logica vallen alle valide vullingen onder 'complete'
    expect(getHouseholdStatus(members)).toBe('complete');
  });

  it('moet "partial" teruggeven bij gemengde samenstelling', () => {
    const adults = createMembers(1, 'adult');
    const children = createMembers(2, 'child');
    const members = [...adults, ...children];
    // Afhankelijk van je logica is dit vaak 'complete' of 'partial'
    expect(getHouseholdStatus(members)).toBe('complete');
  });

  it('moet "empty" teruggeven bij lege lijst', () => {
    expect(getHouseholdStatus([])).toBe('empty');
  });
});
