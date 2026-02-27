// src/app/orchestrators/ResearchOrchestrator.test.ts
/**
 * @file_intent Unit tests voor de ResearchOrchestrator – Privacy-kritische data transformatie.
 * @contract Test PII-isolatie, correcte output structuur en edge cases.
 */

jest.mock('@domain/constants/datakeys', () => ({
  DATA_KEYS: { SETUP: 'setup', HOUSEHOLD: 'household', FINANCE: 'finance', META: 'meta' },
  SUB_KEYS: { MEMBERS: 'members', INCOME: 'income', EXPENSES: 'expenses', ITEMS: 'items' },
}));

jest.mock('@domain/research/PrivacyAirlock', () => ({
  collectAndDistributeData: jest.fn((raw: any, i: number) => ({
    localMember: {
      entityId: raw.id ?? `local-${i}`,
      fieldId: raw.fieldId ?? `f-${i}`,
      memberType: 'adult',
      firstName: raw.firstName ?? 'Test',
      lastName: raw.lastName ?? 'Lid',
      age: raw.age ?? 30,
      finance: {},
    },
    researchPayload: {
      researchId: `res_test${i}`,
      memberType: 'adult',
      age: raw.age ?? 30,
      amount: 0,
      category: 'unassigned',
      timestamp: '2026-01-01T00:00:00.000Z',
    },
  })),
  assertNoPIILeak: jest.fn(),
  // Spiegelt de echte implementatie: geeft de eerste 4 cijfers terug
  extractWijkLevelResearch: jest.fn((postcode: string) =>
    postcode.replace(/[^0-9]/g, '').slice(0, 4)
  ),
}));

jest.mock('@domain/finance/StatementIntakePipeline', () => ({
  dataProcessor: {
    reconcileWithSetup: jest.fn(() => ({
      finalIncome: 300000,
      totalExpenses: 100000,
    })),
  },
}));

// Mock de dependencies van FormStateOrchestrator zodat die gewoon kan laden
jest.mock('@adapters/StateWriter/StateWriterAdapter', () => ({
  StateWriterAdapter: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@adapters/validation/validateAtBoundary', () => ({
  validateAtBoundary: jest.fn(() => ({ success: true, error: null })),
}));

jest.mock('@adapters/validation/ResearchContractAdapter', () => ({
  ResearchValidator: {
    validateMoney: jest.fn(({ amount }: { amount: number }) => ({ amount: amount ?? 0 })),
    validatePayload: jest.fn((p: any) => p),
  },
}));

import { ResearchOrchestrator } from './ResearchOrchestrator';
import type { CsvItem } from '@core/types/research';
import { collectAndDistributeData, assertNoPIILeak } from '@domain/research/PrivacyAirlock';
import { DATA_KEYS } from '@domain/constants/datakeys';

const mockCollectAndDistribute = collectAndDistributeData as jest.Mock;
const mockAssertNoPIILeak = assertNoPIILeak as jest.Mock;

const makeFso = (postcodeOverride = '1234AB') => ({
  getState: () => ({
    data: {
      setup: { postcode: postcodeOverride },
    },
  }),
} as any);

const makeRawMember = (overrides = {}) => ({
  id: 'local-0',
  fieldId: 'f-0',
  firstName: 'Jan',
  lastName: 'Jansen',
  age: 35,
  memberType: 'adult',
  ...overrides,
});

const makeCsvItem = (overrides = {}): CsvItem => ({
  id: 'csv-0',
  amount: 1000,
  amountCents: 100000,
  category: 'Inkomen',
  date: '2026-01-01',
  description: 'Salaris',
  original: {},
  ...overrides,
});

describe('ResearchOrchestrator', () => {

  describe('processAllData - output structuur', () => {
    it('retourneert local en research in de output', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      expect(result).toHaveProperty('local');
      expect(result).toHaveProperty('research');
    });

    it('retourneert local.household met members array', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      expect(result.local[DATA_KEYS.HOUSEHOLD]).toBeDefined();
      expect(Array.isArray(result.local[DATA_KEYS.HOUSEHOLD].members)).toBe(true);
    });

    it('retourneert local.finance met transactions, summary en hasMissingCosts', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      const finance = result.local[DATA_KEYS.FINANCE];
      expect(finance).toHaveProperty('transactions');
      expect(finance).toHaveProperty('summary');
      expect(finance).toHaveProperty('hasMissingCosts');
    });

    it('retourneert research.memberPayloads als array', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      expect(Array.isArray(result.research.memberPayloads)).toBe(true);
    });

    it('retourneert research.financialAnalytics met verplichte velden', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      expect(result.research.financialAnalytics).toHaveProperty('totalIncomeCents');
      expect(result.research.financialAnalytics).toHaveProperty('categoryTotals');
      expect(result.research.financialAnalytics).toHaveProperty('timestamp');
      expect(result.research.financialAnalytics).toHaveProperty('postcodeDigits');
    });

    it('stuurt alleen de cijfers van de postcode door (PII-strip)', () => {
      const orchestrator = new ResearchOrchestrator(makeFso('2718SJ'));
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      expect(result.research.financialAnalytics.postcodeDigits).toBe('2718');
    });

    it('geeft lege string terug bij ontbrekende postcode', () => {
      const orchestrator = new ResearchOrchestrator(makeFso(''));
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      expect(result.research.financialAnalytics.postcodeDigits).toBe('');
    });
  });

  describe('processAllData - member verwerking', () => {
    it('verwerkt meerdere leden correct', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData(
        [makeRawMember(), makeRawMember({ id: 'local-1' })],
        [makeCsvItem()],
        null
      );

      expect(result.local[DATA_KEYS.HOUSEHOLD].members).toHaveLength(2);
      expect(result.research.memberPayloads).toHaveLength(2);
    });

    it('retourneert lege members array bij lege input', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([], [makeCsvItem()], null);

      expect(result.local[DATA_KEYS.HOUSEHOLD].members).toHaveLength(0);
    });

    it('delegeert elk lid aan collectAndDistributeData', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      orchestrator.processAllData([makeRawMember(), makeRawMember()], [], null);

      expect(mockCollectAndDistribute).toHaveBeenCalledTimes(2);
    });
  });

  describe('processAllData - transacties', () => {
    it('bewaart de originele csvTransactions in local.finance', () => {
      const transactions = [makeCsvItem(), makeCsvItem({ category: 'Wonen' })];
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], transactions, null);

      expect(result.local[DATA_KEYS.FINANCE].transactions).toHaveLength(2);
    });

    it('groepeert categoryTotals correct', () => {
      const transactions = [
        makeCsvItem({ category: 'Inkomen', amount: 3000 }),
        makeCsvItem({ category: 'Wonen', amount: 1200 }),
      ];
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], transactions, null);

      expect(result.research.financialAnalytics.categoryTotals).toHaveProperty('Inkomen');
      expect(result.research.financialAnalytics.categoryTotals).toHaveProperty('Wonen');
    });

    it('gebruikt Overig als categorie ontbreekt', () => {
      const transactions = [makeCsvItem({ category: null })];
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], transactions, null);

      expect(result.research.financialAnalytics.categoryTotals).toHaveProperty('Overig');
    });
  });

  describe('processAllData - privacy & security', () => {
    it('roept assertNoPIILeak aan op de research data', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      expect(mockAssertNoPIILeak).toHaveBeenCalled();
    });

    it('memberPayloads bevatten geen firstName of lastName', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      result.research.memberPayloads.forEach(payload => {
        expect(payload).not.toHaveProperty('firstName');
        expect(payload).not.toHaveProperty('lastName');
      });
    });

    it('memberPayloads bevatten wel researchId', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData([makeRawMember()], [makeCsvItem()], null);

      result.research.memberPayloads.forEach(payload => {
        expect(payload).toHaveProperty('researchId');
      });
    });
  });

  describe('processAllData - hasMissingCosts', () => {
    it('detecteert ontbrekende woonkosten als Wonen transactie aanwezig is zonder housingIncluded', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData(
        [makeRawMember()],
        [makeCsvItem({ category: 'Wonen' })],
        { housingIncluded: false }
      );

      expect(result.local[DATA_KEYS.FINANCE].hasMissingCosts).toBe(true);
    });

    it('hasMissingCosts is false als housingIncluded true is', () => {
      const orchestrator = new ResearchOrchestrator(makeFso());
      const result = orchestrator.processAllData(
        [makeRawMember()],
        [makeCsvItem({ category: 'Wonen' })],
        { housingIncluded: true }
      );

      expect(result.local[DATA_KEYS.FINANCE].hasMissingCosts).toBe(false);
    });
  });

});
