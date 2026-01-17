// src/logic/__tests__/finance.test.ts
import { computePhoenixSummary } from '@kernel/finance';
import { UndoResult } from '@shared-types/finance';

describe('Finance Logic — Phoenix Integriteit', () => {
  it('moet het totaal van transacties correct berekenen', () => {
    const mockData: UndoResult[] = [
      {
        id: '1',
        amount: 1000,
        currency: 'EUR',
        description: 'Inkomsten',
        reason: 'salary', // Verplicht volgens interface
        timestamp: '2026-01-05T00:00:00Z',
        schemaVersion: '1.0.0', // Verplicht volgens interface
      },
      {
        id: '2',
        amount: -500,
        currency: 'EUR',
        description: 'Uitgaven',
        reason: 'groceries',
        timestamp: '2026-01-05T01:00:00Z',
        schemaVersion: '1.0.0',
      },
    ];

    const result = computePhoenixSummary(mockData);
    expect(result.netCents).toBe(500);
  });
});
