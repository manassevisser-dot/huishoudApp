// src/app/orchestrators/FinancialOrchestrator.test.ts
/**
 * @file_intent Unit tests voor de FinancialOrchestrator – Pure financiële ViewModel transformatie.
 * @contract Test de transformatie van centen naar geformatteerde display-strings en de null-safety.
 */

jest.mock('@domain/constants/datakeys', () => ({
  DATA_KEYS: { SETUP: 'setup', HOUSEHOLD: 'household', FINANCE: 'finance', META: 'meta' },
  SUB_KEYS: { MEMBERS: 'members', INCOME: 'income', EXPENSES: 'expenses', ITEMS: 'items' },
}));

jest.mock('@domain/rules/calculateRules', () => ({
  computePhoenixSummary: jest.fn(),
}));

jest.mock('@domain/helpers/numbers', () => ({
  formatCurrency: jest.fn((cents: number) => `€ ${(cents / 100).toFixed(2)}`),
}));

import { FinancialOrchestrator } from './FinancialOrchestrator';
import { computePhoenixSummary } from '@domain/rules/calculateRules';
import type { FormState } from '@core/types/core';

const mockComputePhoenixSummary = computePhoenixSummary as jest.Mock;

const makeFso = () => ({} as any);

const makeState = (financeOverride?: unknown): FormState => ({
  schemaVersion: '1.0',
  activeStep: 'DASHBOARD',
  currentScreenId: 'dashboard',
  isValid: true,
  viewModels: {},
  data: {
    setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Geen', woningType: 'Koop' },
    household: { members: [] },
    finance: financeOverride !== undefined ? financeOverride as any : {
      income: { items: [], totalAmount: 0 },
      expenses: { items: [], totalAmount: 0 },
    },
  },
  meta: { lastModified: new Date().toISOString(), version: 1 },
});

describe('FinancialOrchestrator', () => {

  describe('prepareViewModel - happy path', () => {
    it('retourneert correcte display strings op basis van computePhoenixSummary', () => {
      mockComputePhoenixSummary.mockReturnValue({
        totalIncomeCents: 300000,
        totalExpensesCents: 120000,
        netCents: 180000,
      });

      const orchestrator = new FinancialOrchestrator(makeFso());
      const result = orchestrator.prepareViewModel(makeState());

      expect(result.totalIncomeDisplay).toBe('€ 3000.00');
      expect(result.totalExpensesDisplay).toBe('€ 1200.00');
      expect(result.netDisplay).toBe('€ 1800.00');
    });

    it('delegeert finance data aan computePhoenixSummary', () => {
      mockComputePhoenixSummary.mockReturnValue({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });

      const state = makeState({ income: { items: [{ amountCents: 100 }] } });
      const orchestrator = new FinancialOrchestrator(makeFso());
      orchestrator.prepareViewModel(state);

      expect(mockComputePhoenixSummary).toHaveBeenCalledWith(state.data.finance);
    });
  });

  describe('prepareViewModel - null/undefined safety', () => {
    it('retourneert nul-waarden als finance undefined is', () => {
      const state = makeState(undefined);
      (state.data as any).finance = undefined;

      const orchestrator = new FinancialOrchestrator(makeFso());
      const result = orchestrator.prepareViewModel(state);

      expect(result.totalIncomeDisplay).toBe('€ 0,00');
      expect(result.totalExpensesDisplay).toBe('€ 0,00');
      expect(result.netDisplay).toBe('€ 0,00');
      expect(mockComputePhoenixSummary).not.toHaveBeenCalled();
    });

    it('retourneert nul-waarden als finance null is', () => {
      const state = makeState(null);

      const orchestrator = new FinancialOrchestrator(makeFso());
      const result = orchestrator.prepareViewModel(state);

      expect(result.totalIncomeDisplay).toBe('€ 0,00');
      expect(result.totalExpensesDisplay).toBe('€ 0,00');
      expect(result.netDisplay).toBe('€ 0,00');
    });

    it('retourneert altijd alle drie de ViewModel-velden', () => {
      mockComputePhoenixSummary.mockReturnValue({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });

      const orchestrator = new FinancialOrchestrator(makeFso());
      const result = orchestrator.prepareViewModel(makeState());

      expect(result).toHaveProperty('totalIncomeDisplay');
      expect(result).toHaveProperty('totalExpensesDisplay');
      expect(result).toHaveProperty('netDisplay');
    });
  });

});
