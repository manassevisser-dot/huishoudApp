// src/services/migrationService.test.ts
/**
 * @file_intent Unit tests voor de MigrationService – Legacy data transformatie naar Phoenix FormState.
 * @contract Test defensieve checks, fallbacks, en correcte mapping van V0 naar Phoenix FormState.
 */

// Override de gedeelde jest.setup mock die SUB_KEYS mist
jest.mock('@domain/constants/datakeys', () => ({
  DATA_KEYS: { SETUP: 'setup', HOUSEHOLD: 'household', FINANCE: 'finance', META: 'meta' },
  SUB_KEYS: { MEMBERS: 'members', INCOME: 'income', EXPENSES: 'expenses', ITEMS: 'items' },
}));

import { DATA_KEYS } from '@domain/constants/datakeys';
import type { FormState } from '@core/types/core';

// Mock @test-utils om zware React Native imports te vermijden tijdens unit tests
jest.mock('@test-utils/index', () => ({
  createMockState: (overrides: Partial<FormState> = {}): FormState => ({
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentScreenId: '1setupHousehold',
    isValid: true,
    viewModels: {},
    data: {
      setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Geen', woningType: 'Koop' },
      household: { members: [], huurtoeslag: 0, zorgtoeslag: 0 },
      finance: { income: { items: [], totalAmount: 0 }, expenses: { items: [], totalAmount: 0 } },
      latestTransaction: { latestTransactionDate: '', latestTransactionAmount: 0, latestTransactionCategory: null, latestTransactionDescription: '', latestPaymentMethod: 'pin' },
    },
    meta: { lastModified: new Date().toISOString(), version: 1 },
    ...overrides,
  }),
}));

import { migrateToPhoenix } from './migrationService';

describe('migrateToPhoenix', () => {

  describe('null/undefined input', () => {
    it('retourneert een geldige base state bij null input', async () => {
      const result = await migrateToPhoenix(null);
      expect(result).toBeDefined();
      expect(result.activeStep).toBe('LANDING');
      expect(result.isValid).toBe(true);
    });

    it('retourneert een geldige base state bij undefined input', async () => {
      const result = await migrateToPhoenix(undefined);
      expect(result).toBeDefined();
      expect(result.activeStep).toBe('LANDING');
    });

    it('zet lastModified bij null input', async () => {
      const result = await migrateToPhoenix(null);
      expect(result.meta.lastModified).toBeDefined();
      expect(() => new Date(result.meta.lastModified)).not.toThrow();
    });
  });

  describe('setup data migratie', () => {
    it('migreert aantalMensen van root level', async () => {
      const result = await migrateToPhoenix({ aantalMensen: 4 });
      expect(result.data[DATA_KEYS.SETUP].aantalMensen).toBe(4);
    });

    it('migreert aantalVolwassen van root level', async () => {
      const result = await migrateToPhoenix({ aantalVolwassen: 2 });
      expect(result.data[DATA_KEYS.SETUP].aantalVolwassen).toBe(2);
    });

    it('valt terug op base state als aantalMensen ontbreekt', async () => {
      const result = await migrateToPhoenix({});
      expect(typeof result.data[DATA_KEYS.SETUP].aantalMensen).toBe('number');
    });

    it('migreert autoCount correct', async () => {
      const result = await migrateToPhoenix({ setup: { autoCount: 'Twee' } });
      expect(result.data[DATA_KEYS.SETUP].autoCount).toBe('Twee');
    });

    it('gebruikt Nee als autoCount fallback bij ontbrekende waarde', async () => {
      const result = await migrateToPhoenix({});
      expect(result.data[DATA_KEYS.SETUP].autoCount).toBe('Nee');
    });
  });

  describe('household member migratie', () => {
    it('migreert leden array naar members', async () => {
      const result = await migrateToPhoenix({
        leden: [{ naam: 'Jan Jansen', memberType: 'adult', age: 35 }],
      });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members).toHaveLength(1);
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].firstName).toBe('Jan');
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].lastName).toBe('Jansen');
    });

    it('migreert household.members array', async () => {
      const result = await migrateToPhoenix({
        household: { members: [{ naam: 'Marie', memberType: 'adult', age: 30 }] },
      });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members).toHaveLength(1);
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].firstName).toBe('Marie');
    });

    it('gebruikt Bewoner als firstName fallback bij lege naam', async () => {
      const result = await migrateToPhoenix({
        leden: [{ naam: '', memberType: 'adult' }],
      });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].firstName).toBe('Bewoner');
    });

    it('migreert memberType child correct', async () => {
      const result = await migrateToPhoenix({
        leden: [{ naam: 'Kind', memberType: 'child' }],
      });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].memberType).toBe('child');
    });

    it('gebruikt DEFAULT_CHILD_AGE (10) als age ontbreekt voor kind', async () => {
      const result = await migrateToPhoenix({
        leden: [{ naam: 'Kind', memberType: 'child' }],
      });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].age).toBe(10);
    });

    it('gebruikt DEFAULT_ADULT_AGE (35) als age ontbreekt voor volwassene', async () => {
      const result = await migrateToPhoenix({
        leden: [{ naam: 'Volwassene', memberType: 'adult' }],
      });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].age).toBe(35);
    });

    it('genereert entityId en fieldId als die ontbreken', async () => {
      const result = await migrateToPhoenix({
        leden: [{ naam: 'Iemand' }],
      });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].entityId).toBe('mem_0');
      expect(result.data[DATA_KEYS.HOUSEHOLD].members[0].fieldId).toBe('field_0');
    });

    it('handelt niet-object leden af met fallback', async () => {
      const result = await migrateToPhoenix({ leden: [null, undefined, 'ongeldige string'] });
      expect(result.data[DATA_KEYS.HOUSEHOLD].members).toHaveLength(3);
      result.data[DATA_KEYS.HOUSEHOLD].members.forEach(m => {
        expect(m.firstName).toBe('Bewoner');
      });
    });

    it('retourneert lege members array als er geen ledendata is', async () => {
      const result = await migrateToPhoenix({});
      expect(result.data[DATA_KEYS.HOUSEHOLD].members).toEqual([]);
    });
  });

  describe('finance data migratie', () => {
    it('migreert income items', async () => {
      const result = await migrateToPhoenix({
        income: { items: [{ amount: 3000, category: 'Salaris' }] },
      });
      expect(result.data[DATA_KEYS.FINANCE].income.items).toHaveLength(1);
    });

    it('migreert expenses items', async () => {
      const result = await migrateToPhoenix({
        expenses: { items: [{ amount: 1200, category: 'Huur' }] },
      });
      expect(result.data[DATA_KEYS.FINANCE].expenses.items).toHaveLength(1);
    });

    it('gebruikt lege arrays als income/expenses ontbreken', async () => {
      const result = await migrateToPhoenix({});
      expect(result.data[DATA_KEYS.FINANCE].income.items).toEqual([]);
      expect(result.data[DATA_KEYS.FINANCE].expenses.items).toEqual([]);
    });

    it('filtert niet-object items uit income', async () => {
      const result = await migrateToPhoenix({
        income: { items: [null, { amount: 1000 }, 'ongeldig'] },
      });
      // null en string worden vervangen door lege objecten
      expect(result.data[DATA_KEYS.FINANCE].income.items).toHaveLength(3);
    });
  });

  describe('meta migratie', () => {
    it('gebruikt migratedAt als lastModified', async () => {
      const migratedAt = '2025-01-01T00:00:00.000Z';
      const result = await migrateToPhoenix({ metadata: { migratedAt } });
      expect(result.meta.lastModified).toBe(migratedAt);
    });

    it('migreert schemaVersion naar meta.version', async () => {
      const result = await migrateToPhoenix({ metadata: { schemaVersion: '2' } });
      expect(result.meta.version).toBe(2);
    });

    it('gebruikt base meta.version als schemaVersion geen getal is', async () => {
      const result = await migrateToPhoenix({ metadata: { schemaVersion: 'ongeldig' } });
      expect(typeof result.meta.version).toBe('number');
    });
  });

  describe('output integriteit', () => {
    it('bevat altijd schemaVersion 1.0', async () => {
      const result = await migrateToPhoenix({});
      expect(result.schemaVersion).toBe('1.0');
    });

    it('bevat altijd data, meta, activeStep en isValid', async () => {
      const result = await migrateToPhoenix({});
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.activeStep).toBeDefined();
      expect(result.isValid).toBeDefined();
    });
  });

});
