import { getHouseholdStatus } from '@domain/household';

describe('Household Domain Logic', () => {
  it('RULE [2024-12-07]: moet een speciale status geven bij > 5 volwassenen', () => {
    const stats = { adultCount: 6, childCount: 0 };
    expect(getHouseholdStatus(stats)).toBe('SPECIAL_LARGE');
  });

  it('moet een standaard status geven bij exact 5 volwassenen', () => {
    const stats = { adultCount: 5, childCount: 2 };
    expect(getHouseholdStatus(stats)).toBe('STANDARD');
  });
});
