// src/services/__tests__/migration.fixture.test.ts
import { migrateTransactionsToPhoenix } from '../transactionService';

describe('Migration Fixture', () => {
  it('migreert oude data naar de nieuwe Phoenix structuur', async () => {
    // 1. Arrange: Zorg dat er minimaal één lid in de oude data zit
    const oldData = {
      household: {
        leden: [{ firstName: 'Test Gebruiker', type: 'adult' }],
      },
      setup: {
        aantalMensen: 1,
        aantalVolwassen: 1,
      },
    };

    // 2. Act
    const result = await migrateTransactionsToPhoenix(oldData);

    // 3. Assert
    expect(result.schemaVersion).toBe('1.0');

    // Deze faalde eerst (was 0), nu zijn er leden dus wordt het 1
    expect(result.meta.itemsProcessed).toBe(1);

    // Check of het lid ook echt is gemigreerd
    expect(result.data.household.members.length).toBe(1);
    expect(result.data.household.members[0].firstName).toBe('Test');
  });
});
