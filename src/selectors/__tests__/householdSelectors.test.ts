import { selectIsSpecialStatus } from '../../selectors/householdSelectors';
import { FormState } from '../../shared-types/form';

describe('WAI-003: Household Selectors', () => {
  // We maken een helper om een valide basis-state te genereren
  const createBaseState = (aantalVolwassen: number): FormState => ({
    currentPageId: 'setup',
    activeStep: 'WIZARD',
    isValid: true,
    data: {
      setup: { aantalVolwassen },
      household: {
        // We vullen members voor de volledigheid, 
        // hoewel de huidige selector naar setup kijkt
        members: Array(aantalVolwassen).fill(null).map((_, i) => ({
          entityId: `m${i}`,
          fieldId: 'member_1', // VOEG DIT TOE
          memberType: 'adult',
          naam: `Member ${i + 1}`
        }))
      },
      finance: {},
    }
  });

  it('moet true teruggeven voor 6 volwassenen (Project Eis 2025)', () => {
    const mockState = createBaseState(6);
    expect(selectIsSpecialStatus(mockState)).toBe(true);
  });

  it('moet false teruggeven voor 2 volwassenen', () => {
    const mockState = createBaseState(2);
    expect(selectIsSpecialStatus(mockState)).toBe(false);
  });

  it('moet false teruggeven bij een lege state', () => {
    const mockState = createBaseState(0);
    expect(selectIsSpecialStatus(mockState)).toBe(false);
  });
});