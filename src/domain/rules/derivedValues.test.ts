// src/domain/rules/derivedValues.test.ts

import { derivedValueRules } from './derivedValues';
import { VisibilityContext } from './fieldVisibility';

describe('derivedValueRules', () => {
  describe('kinderenLabel', () => {
    it('berekent aantal kinderen als verschil tussen mensen en volwassenen', () => {
      const ctx = {
        getValue: (key: string) => {
          if (key === 'aantalMensen') return 4;
          if (key === 'aantalVolwassen') return 2;
          return undefined;
        },
      } as VisibilityContext;

      expect(derivedValueRules.kinderenLabel(ctx)).toBe(2);
    });

    it('retourneert 0 als er geen kinderen zijn', () => {
      const ctx = {
        getValue: (key: string) => {
          if (key === 'aantalMensen') return 2;
          if (key === 'aantalVolwassen') return 2;
          return undefined;
        },
      } as VisibilityContext;

      expect(derivedValueRules.kinderenLabel(ctx)).toBe(0);
    });

    it('gebruikt 0 als fallback bij ontbrekende waarden', () => {
      const ctx = {
        getValue: (_: string) => undefined,
      } as VisibilityContext;

      expect(derivedValueRules.kinderenLabel(ctx)).toBe(0);
    });
  });
});