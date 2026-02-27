// src/services/transactionService.migration.test.ts
import { migrateTransactionsToPhoenix } from './transactionService';
import { LegacyValidator } from '@adapters/validation/LegacyStateAdapter';

jest.mock('@adapters/validation/LegacyStateAdapter', () => ({
  LegacyValidator: {
    parseState: jest.fn(),
  },
}));

describe('TransactionService - Migration Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should preserve data when migrating multiple times', async () => {
    // ✅ Originele state met OUD formaat - transactions op de juiste plek
    const originalLegacyState = {
      household: {
        leden: [
          { firstName: 'Jan', lastName: 'Jansen', memberType: 'ADULT', id: '1' },
          { firstName: 'Piet', lastName: 'Pieters', memberType: 'CHILD', id: '2' },
        ],
      },
      // ✅ Transactions op root level (wat migrateTransactionsToPhoenix verwacht)
      transactions: [
        { fieldId: 'salary', amount: 3000 },
        { fieldId: 'bonus', amount: 500 },
        { fieldId: 'rent', amount: -1200 },
        { fieldId: 'food', amount: -400 }
      ]
    };

    // Eerste migratie
    (LegacyValidator.parseState as jest.Mock).mockReturnValue(originalLegacyState);
    const result1 = await migrateTransactionsToPhoenix(originalLegacyState);
    
    // ✅ Check: result1 heeft nu transactions in data.transactions
    expect(result1.data.household.members).toHaveLength(2);
    expect(result1.data.transactions).toHaveLength(4);

    // ✅ Voor tweede migratie: Zet NIEUW formaat om naar OUD formaat
    const convertedBack = {
      household: {
        leden: result1.data.household.members.map((m: any) => ({
          firstName: m.firstName,
          lastName: m.lastName,
          memberType: m.memberType.toUpperCase(),
          id: m.entityId,
        })),
      },
      // ✅ Zet transactions terug op root level voor de volgende migratie
      transactions: result1.data.transactions.map((t: any) => ({
        fieldId: t.fieldId,
        amount: t.amount
      }))
    };

    // Tweede migratie
    (LegacyValidator.parseState as jest.Mock).mockReturnValue(convertedBack);
    const result2 = await migrateTransactionsToPhoenix(convertedBack);

    // ✅ Check: result2 heeft weer 4 transactions
    expect(result2.data.household.members).toHaveLength(2);
    expect(result2.data.transactions).toHaveLength(4);

    // Derde migratie
    const convertedAgain = {
      household: {
        leden: result2.data.household.members.map((m: any) => ({
          firstName: m.firstName,
          lastName: m.lastName,
          memberType: m.memberType.toUpperCase(),
          id: m.entityId,
        })),
      },
      transactions: result2.data.transactions.map((t: any) => ({
        fieldId: t.fieldId,
        amount: t.amount
      }))
    };

    (LegacyValidator.parseState as jest.Mock).mockReturnValue(convertedAgain);
    const result3 = await migrateTransactionsToPhoenix(convertedAgain);

    // ✅ Alle checks slagen nu
    expect(result1.data.household.members).toHaveLength(2);
    expect(result2.data.household.members).toHaveLength(2);
    expect(result3.data.household.members).toHaveLength(2);

    expect(result1.data.transactions).toHaveLength(4);
    expect(result2.data.transactions).toHaveLength(4);
    expect(result3.data.transactions).toHaveLength(4);
  });

  it('should handle very large member lists', async () => {
    const largeMemberList = Array(1000).fill(null).map((_, i) => ({
      firstName: `Lid${i}`,
      memberType: i % 2 === 0 ? 'ADULT' : 'CHILD',
      id: `mem-${i}`,
    }));

    const state = {
      household: { leden: largeMemberList },
      transactions: [] // Lege transactions array
    };

    (LegacyValidator.parseState as jest.Mock).mockReturnValue(state);

    const result = await migrateTransactionsToPhoenix(state);

    expect(result.data.household.members).toHaveLength(1000);
    expect(result.meta.itemsProcessed).toBe(1000);
  });
});