import { getHouseholdStatus } from '@domain/household';

describe('Household Domain Logic', () => {
  it('RULE [2024-12-07]: geeft SPECIAL_LARGE status bij > 5 volwassenen', () => {
    const stats = { adultCount: 6, childCount: 0 };
    expect(getHouseholdStatus(stats)).toBe('SPECIAL_LARGE');
  });

  it('geeft STANDARD status bij exact 5 volwassenen', () => {
    const stats = { adultCount: 5, childCount: 2 };
    expect(getHouseholdStatus(stats)).toBe('STANDARD');
  });
});