import { computePhoenixSummary } from '../../logic/finance';
import { selectFinancialSummaryVM } from '../financialSelectors';
import { FormState } from '../../shared-types/form';
import Logger from '../../services/logger'; // Default import

// Mock de logger volgens jouw structuur
jest.mock('../../services/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  },
  logger: {
     info: jest.fn()
  }
}));

describe('Phoenix Financial Flow: Validatie op basis van broncode', () => {
  
  const mockState = {
    income: {
      items: [
        { id: '1', amountCents: 200000 }, // €2000
      ]
    },
    expenses: {
      items: [
        { id: '2', amountCents: 50000 },  // €500
      ]
    }
  } as unknown as FormState;

  it('Logic: computePhoenixSummary moet centen correct optellen', () => {
    const result = computePhoenixSummary(mockState);
    expect(result.totalIncomeCents).toBe(200000);
    expect(result.totalExpensesCents).toBe(50000);
    expect(result.netCents).toBe(150000);
  });

  it('Selector: selectFinancialSummaryVM moet de totals nesting bevatten', () => {
    const vm = selectFinancialSummaryVM(mockState);
    
    // We checken of de structuur { totals: { ... } } aanwezig is
    expect(vm.totals).toBeDefined();
    expect(vm.totals.totalIncomeEUR).toBeDefined();
    
    // Afhankelijk van wat je toCents() utility doet (euro string of getal)
    // Als toCents(200000) de waarde 2000 teruggeeft:
    // expect(vm.totals.totalIncomeEUR).toBe(2000);
  });
});