import { fieldVisibilityRules, VisibilityContext } from 'src/domain/rules/fieldVisibility';

describe('Field Visibility Rules', () => {
  // Helper om snel een context te maken voor de test
  const createMockCtx = (data: Record<string, unknown>): VisibilityContext => ({
    getValue: (fieldId: string) => data[fieldId]
  });

  describe('aantalVolwassen', () => {
    test('moet onzichtbaar zijn bij 0 mensen', () => {
      const ctx = createMockCtx({ aantalMensen: 0 });
      expect(fieldVisibilityRules.aantalVolwassen(ctx)).toBe(false);
    });

    test('moet zichtbaar zijn bij 1 of meer mensen', () => {
      const ctx = createMockCtx({ aantalMensen: 1 });
      expect(fieldVisibilityRules.aantalVolwassen(ctx)).toBe(true);
    });
  });

  describe('kinderenLabel', () => {
    test('moet onzichtbaar zijn als mensen gelijk is aan volwassenen', () => {
      const ctx = createMockCtx({ aantalMensen: 2, aantalVolwassen: 2 });
      expect(fieldVisibilityRules.kinderenLabel(ctx)).toBe(false);
    });

    test('moet zichtbaar zijn als er meer mensen zijn dan volwassenen', () => {
      const ctx = createMockCtx({ aantalMensen: 3, aantalVolwassen: 2 });
      expect(fieldVisibilityRules.kinderenLabel(ctx)).toBe(true);
    });

    test('moet robuust omgaan met missende waarden', () => {
      const ctx = createMockCtx({}); // Geeft undefined terug
      expect(fieldVisibilityRules.kinderenLabel(ctx)).toBe(false);
    });
  });

  describe('car_repeater', () => {
    test('moet onzichtbaar zijn als autoCount "Nee" is', () => {
      const ctx = createMockCtx({ autoCount: 'Nee' });
      expect(fieldVisibilityRules.car_repeater(ctx)).toBe(false);
    });

    test('moet zichtbaar zijn bij elk ander antwoord (Ja / 1 / 2)', () => {
      const ctx = createMockCtx({ autoCount: '1' });
      expect(fieldVisibilityRules.car_repeater(ctx)).toBe(true);
    });
  });

  describe('member_income_details', () => {
    test('moet zichtbaar zijn als er een memberId is', () => {
      const ctx = createMockCtx({});
      expect(fieldVisibilityRules.member_income_details(ctx, 'm1')).toBe(true);
    });

    test('moet onzichtbaar zijn zonder memberId', () => {
      const ctx = createMockCtx({});
      expect(fieldVisibilityRules.member_income_details(ctx, undefined)).toBe(false);
    });
  });
});