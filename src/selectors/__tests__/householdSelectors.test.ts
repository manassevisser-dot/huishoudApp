import { selectIsSpecialStatus } from '@selectors/householdSelectors';
import { DATA_KEYS } from '@domain/constants/datakeys';
import { FormState } from '../../shared-types/form';

describe('WAI-003: Household Selectors', () => {
  it('moet true teruggeven voor 6 volwassenen (Project Eis 2025)', () => {
    // FIX: Gebruik de DATA_KEYS en de juiste structuur
    const mockState = {
      [DATA_KEYS.HOUSEHOLD]: {
        leden: [
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' },
          { memberType: 'adult' },
        ],
      },
    } as unknown as FormState;

    // FIX: state correct meegeven aan de selector
    expect(selectIsSpecialStatus(mockState)).toBe(true);
  });

  it('moet false teruggeven bij een lege state', () => {
    const mockState = {} as unknown as FormState;
    expect(selectIsSpecialStatus(mockState)).toBe(false);
  });
});