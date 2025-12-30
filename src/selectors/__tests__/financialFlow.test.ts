
// src/selectors/__tests__/financialSelectors.test.ts
import { computePhoenixSummary } from '../../logic/finance';
import { selectFinancialSummaryVM } from '../financialSelectors';
import { FormState } from '../../shared-types/form';
import Logger from '../../services/logger'; // ✅ default import blijft zo

// ✅ Consistente mock: default export met info/warn/error/log methods
jest.mock('../../services/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  },
}));

describe('Phoenix Financial Flow: Validatie op basis van broncode', () => {
  // Phoenix-vorm: alles onder data.finance
  const mockState = {
    schemaVersion: '1.0',
    data: {
      setup: {},
      household: { members: [] },
      finance: {
        income: {
          items: [
            { id: '1', amountCents: 200000, frequency: 'month' }, // €2000
          ],
        },
        expenses: {
          items: [
            { id: '2', amountCents: 50000, frequency: 'month' }, // €500
          ],
        },
      },
    },
  } as unknown as FormState;

  it('Logic: computePhoenixSummary telt centen correct op', () => {
    const result = computePhoenixSummary(mockState);
    expect(result.totalIncomeCents).toBe(200000);
    expect(result.totalExpensesCents).toBe(50000);
    expect(result.netCents).toBe(150000);
  });

  it('Selector: selectFinancialSummaryVM levert totals-nesting', () => {
    const vm = selectFinancialSummaryVM(mockState);

    expect(vm.totals).toBeDefined();
    expect(vm.totals.totalIncomeEUR).toBeDefined();
    expect(vm.totals.totalExpensesEUR).toBeDefined();
    expect(vm.totals.netEUR).toBeDefined();

    // Als toCents(200000) → 2000 (number):
    // expect(vm.totals.totalIncomeEUR).toBe(2000);

    // Als toCents formatteert naar string:
    // expect(vm.totals.totalIncomeEUR).toBe('€ 2.000,00');
  });

  it('Selector: logt een info-regel bij het bouwen van de VM', () => {
    const vm = selectFinancialSummaryVM(mockState);
    expect(Logger.info).toHaveBeenCalledWith('Financial VM generated');
    expect(vm).toBeTruthy();
  });
});
