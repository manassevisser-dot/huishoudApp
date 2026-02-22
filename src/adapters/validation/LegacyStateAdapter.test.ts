// src/adapters/validation/LegacyStateAdapter.test.ts

import { LegacyValidator, LegacyState } from './LegacyStateAdapter';

describe('LegacyValidator', () => {
  describe('parseState', () => {
    it('parsed een minimale legacy state zonder fouten', () => {
      const input = {
        setup: { aantalMensen: 3 },
        data: {
          setup: { autoCount: 'Een' },
          household: {
            leden: [
              { id: 'm1', firstName: 'Jan', memberType: 'adult' },
            ],
          },
          finance: {
            income: {
              items: [{ fieldId: 'nettoSalaris', amount: 2500 }],
            },
            expenses: {
              items: [{ fieldId: 'huur', amount: 800 }],
            },
          },
        },
        transactions: [{ fieldId: 'csv_0', amount: 100 }],
      };

      const result = LegacyValidator.parseState(input);
      expect(result).toEqual(input);
    });

    it('parsed leden op root-niveau én in data.household', () => {
      const input = {
        leden: [{ naam: 'Piet', type: 'child' }],
        household: { leden: [{ naam: 'Klaas', type: 'adult' }] },
        data: {
          leden: [{ naam: 'Eva', type: 'teenager' }],
          household: { leden: [{ naam: 'Lotte', type: 'senior' }] },
        },
      };

      const result = LegacyValidator.parseState(input);
      expect(result.leden).toHaveLength(1);
      expect(result.household?.leden).toHaveLength(1);
      expect(result.data?.leden).toHaveLength(1);
      expect(result.data?.household?.leden).toHaveLength(1);
    });

    it('handelt ontbrekende secties graceful af', () => {
      const input = {}; // helemaal leeg

      const result = LegacyValidator.parseState(input);
      expect(result).toEqual({});
    });

    it('filtert ongeldige velden uit (fail-closed)', () => {
      const input = {
        setup: { aantalMensen: 'drie' }, // string i.p.v. number → toegestaan door ZodjsonPrimitive
        data: {
          finance: {
            income: {
              items: [
                { fieldId: 'salaris', amount: '2500' }, // amount moet number zijn → wordt genegeerd
                { fieldId: 'bonus', amount: 500 },
              ],
            },
          },
        },
        // Voeg een niet-toegestaan veld toe buiten schema
        __proto__: {}, // wordt genegeerd door .passthrough()
      };

      const result = LegacyValidator.parseState(input);

      // amount als string wordt genegeerd → item wordt gefilterd
      expect(result.data?.finance?.income?.items).toHaveLength(1);
      expect((result.data?.finance?.income?.items as any[])?.[0].fieldId).toBe('bonus');
    });

    it('accepteert alleen JSON-primitive waarden in setup', () => {
      const input = {
        setup: {
          aantalMensen: 3,
          woningType: 'Huur',
          actief: true,
          niks: null,
          // Dit zou falen als het een object was, maar ZodjsonPrimitive staat alleen primitieven toe
        },
      };

      const result = LegacyValidator.parseState(input);
      expect(result.setup).toEqual(input.setup);
    });

    it('retourneert leeg object bij volledig ongeldige input', () => {
      const result1 = LegacyValidator.parseState(null);
      const result2 = LegacyValidator.parseState(undefined);
      const result3 = LegacyValidator.parseState('not an object');

      expect(result1).toEqual({});
      expect(result2).toEqual({});
      expect(result3).toEqual({});
    });
  });
});