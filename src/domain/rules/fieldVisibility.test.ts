// src/domain/rules/fieldVisibility.test.ts
import { fieldVisibilityRules, uiHints } from './fieldVisibility';
import type { VisibilityContext, VisibilityKnownFields } from './fieldVisibility';

// Helper om mock-context te maken
// src/domain/rules/fieldVisibility.test.ts

const createMockCtx = (values: Partial<VisibilityKnownFields>): VisibilityContext => ({
  getValue: <K extends keyof VisibilityKnownFields>(fieldId: K): VisibilityKnownFields[K] => {
    // Gebruik fallback-waarden uit het echte schema
    const fallbacks: VisibilityKnownFields = {
      aantalMensen: 0,
      aantalVolwassen: 0,
      woningType: 'Huur',
      autoCount: 'Geen',
      household: { members: [] },
    };

    if (fieldId in values && values[fieldId] !== undefined) {
      return values[fieldId] as VisibilityKnownFields[K];
    }

    return fallbacks[fieldId];
  },
});

describe('fieldVisibilityRules', () => {
  describe('isAdultInputVisible', () => {
    it('is true bij 1 of meer mensen', () => {
      const ctx = createMockCtx({ aantalMensen: 1 });
      expect(fieldVisibilityRules.isAdultInputVisible(ctx)).toBe(true);
    });

    it('is false bij 0 mensen', () => {
      const ctx = createMockCtx({ aantalMensen: 0 });
      expect(fieldVisibilityRules.isAdultInputVisible(ctx)).toBe(false);
    });
  });

  describe('calculateChildrenCount', () => {
    it('is true als er meer mensen dan volwassenen zijn', () => {
      const ctx = createMockCtx({ aantalMensen: 3, aantalVolwassen: 2 });
      expect(fieldVisibilityRules.calculateChildrenCount(ctx)).toBe(true);
    });

    it('is false als mensen gelijk is aan volwassenen', () => {
      const ctx = createMockCtx({ aantalMensen: 2, aantalVolwassen: 2 });
      expect(fieldVisibilityRules.calculateChildrenCount(ctx)).toBe(false);
    });
  });

  describe('member_income_details', () => {
    it('is true bij geldige memberId', () => {
      expect(fieldVisibilityRules.member_income_details({} as any, 'mem_0_1')).toBe(true);
    });

    it('is false bij lege memberId', () => {
      expect(fieldVisibilityRules.member_income_details({} as any, '')).toBe(false);
      expect(fieldVisibilityRules.member_income_details({} as any, undefined)).toBe(false);
    });
  });

  describe('showMaritalStatus', () => {
    it('is true bij >1 volwassene', () => {
      const ctx = createMockCtx({ aantalVolwassen: 2 });
      expect(fieldVisibilityRules.showMaritalStatus(ctx)).toBe(true);
    });

    it('is false bij ≤1 volwassene', () => {
      const ctx = createMockCtx({ aantalVolwassen: 1 });
      expect(fieldVisibilityRules.showMaritalStatus(ctx)).toBe(false);
    });
  });

  describe('showHuurtoeslag', () => {
    it('is true bij woningType = "Huur"', () => {
      const ctx = createMockCtx({ woningType: 'Huur' });
      expect(fieldVisibilityRules.showHuurtoeslag(ctx)).toBe(true);
    });

    it('is false bij andere woningtypes', () => {
      const ctx = createMockCtx({ woningType: 'Koop' });
      expect(fieldVisibilityRules.showHuurtoeslag(ctx)).toBe(false);
    });
  });

  describe('showKgb', () => {
    it('is true als er kinderen zijn', () => {
      const ctx = createMockCtx({ aantalMensen: 3, aantalVolwassen: 2 });
      expect(fieldVisibilityRules.showKgb(ctx)).toBe(true);
    });

    it('is false zonder kinderen', () => {
      const ctx = createMockCtx({ aantalMensen: 2, aantalVolwassen: 2 });
      expect(fieldVisibilityRules.showKgb(ctx)).toBe(false);
    });
  });

  describe('hasWorkSelected / hasBenefitSelected / isPensionado', () => {
    const createMemberCtx = (
      memberData: any
    ): VisibilityContext => ({
      getValue: <K extends keyof VisibilityKnownFields>(
        fieldId: K
      ): VisibilityKnownFields[K] => {
    
        if (fieldId === 'household') {
          return { members: [memberData] } as VisibilityKnownFields[K];
        }
    
        throw new Error(`Unhandled fieldId in test mock: ${String(fieldId)}`);
      },
    });

    it('hasWorkSelected is true als categories.werk = true', () => {
      const ctx = createMemberCtx({ fieldId: 'mem_0_1', categories: { werk: true } });
      expect(fieldVisibilityRules.hasWorkSelected(ctx, 'mem_0_1')).toBe(true);
    });

    it('hasBenefitSelected is true als categories.uitkering = true', () => {
      const ctx = createMemberCtx({ fieldId: 'mem_0_1', categories: { uitkering: true } });
      expect(fieldVisibilityRules.hasBenefitSelected(ctx, 'mem_0_1')).toBe(true);
    });

    it('isPensionado is true bij AOW-leeftijd', () => {
      const ctx = createMemberCtx({ fieldId: 'mem_0_1', leeftijd: 67 });
      expect(fieldVisibilityRules.isPensionado(ctx, 'mem_0_1')).toBe(true);
    });
  });

  describe('isWoningHuur / isWoningKoop / isWoningKamer', () => {
    it('isWoningHuur is true bij "Huur"', () => {
      const ctx = createMockCtx({ woningType: 'Huur' });
      expect(fieldVisibilityRules.isWoningHuur(ctx)).toBe(true);
    });

    it('isWoningKoop is true bij "Koop"', () => {
      const ctx = createMockCtx({ woningType: 'Koop' });
      expect(fieldVisibilityRules.isWoningKoop(ctx)).toBe(true);
    });

    it('isWoningKamer is true bij "Kamer"', () => {
      const ctx = createMockCtx({ woningType: 'Kamer' });
      expect(fieldVisibilityRules.isWoningKamer(ctx)).toBe(true);
    });
  });

  describe('hasCars', () => {
    it('is true bij autoCount = "Een" of "Twee"', () => {
      expect(fieldVisibilityRules.hasCars(createMockCtx({ autoCount: 'Een' }))).toBe(true);
      expect(fieldVisibilityRules.hasCars(createMockCtx({ autoCount: 'Twee' }))).toBe(true);
    });

    it('is false bij autoCount = "Geen"', () => {
      expect(fieldVisibilityRules.hasCars(createMockCtx({ autoCount: 'Geen' }))).toBe(false);
    });
  });
});

describe('uiHints', () => {
  describe('carRepeatCount', () => {
    it('retourneert 0 voor "Geen"', () => {
      const ctx = createMockCtx({ autoCount: 'Geen' });
      expect(uiHints.carRepeatCount(ctx)).toBe(0);
    });

    it('retourneert 1 voor "Een"', () => {
      const ctx = createMockCtx({ autoCount: 'Een' });
      expect(uiHints.carRepeatCount(ctx)).toBe(1);
    });

    it('retourneert 2 voor "Twee"', () => {
      const ctx = createMockCtx({ autoCount: 'Twee' });
      expect(uiHints.carRepeatCount(ctx)).toBe(2);
    });
  });

  describe('carRepeatIndices', () => {
    it('retourneert [] voor "Geen"', () => {
      const ctx = createMockCtx({ autoCount: 'Geen' });
      expect(uiHints.carRepeatIndices(ctx)).toEqual([]);
    });

    it('retourneert [0] voor "Een"', () => {
      const ctx = createMockCtx({ autoCount: 'Een' });
      expect(uiHints.carRepeatIndices(ctx)).toEqual([0]);
    });

    it('retourneert [0,1] voor "Twee"', () => {
      const ctx = createMockCtx({ autoCount: 'Twee' });
      expect(uiHints.carRepeatIndices(ctx)).toEqual([0, 1]);
    });
  });
});