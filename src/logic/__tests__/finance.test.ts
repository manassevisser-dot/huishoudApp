import { computePhoenixSummary } from '@logic/finance'; // Let op de nieuwe functienaam
import { DATA_KEYS } from '@domain/constants/datakeys';
import { FormState } from '../../shared-types/form';

describe('WAI-004C Finance Integratie', () => {
  it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => {
    // We mocken de state zoals de Master Reducer hem opslaat
    const mockState = {
      [DATA_KEYS.FINANCE]: { inkomsten: { bedrag: 10000 } }, // Centen!
      [DATA_KEYS.EXPENSES]: { wonen: { bedrag: 4000 } },
    } as unknown as FormState;

    const s = computePhoenixSummary(mockState);

    expect(s.totalIncomeCents).toBe(10000);
    expect(s.totalExpensesCents).toBe(4000);
    expect(s.netCents).toBe(6000); 
  });
});