import { selectHouseholdStats, selectIsSpecialStatus } from '../householdSelectors';

describe('WAI-003: Household Selectors', () => {
  it('moet true teruggeven voor 6 volwassenen (Project Eis 2025)', () => {
    const mockState = {
      C4: {
        leden: [
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' }, // 6 volwassenen
        ],
      },
    } as any;

    expect(selectIsSpecialStatus(mockState)).toBe(true); // Verwacht true bij > 5 [cite: 33]
  });

  it('moet false teruggeven bij een lege state', () => {
    const mockState = {} as any;
    expect(selectIsSpecialStatus(mockState)).toBe(false); // [cite: 34]
  });
});
