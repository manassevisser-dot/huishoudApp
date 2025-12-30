import { migrateTransactionsToPhoenix } from '../transactionService';

describe('Storage Migration: V0 to Phoenix', () => {
  it('moet oude setup data migreren naar de nieuwe data.setup nesting', async () => {
    // 1. Arrange: Oude "platte" data structuur
    const oldData = {
      aantalMensen: 4,
      aantalVolwassen: 2
    };

    // 2. Act: Voer de migratie uit
    const result = await migrateTransactionsToPhoenix(oldData);

    // 3. Assert: Controleer de geneste structuur (Project Phoenix 2025 standaard)
    expect(result).toBeDefined();
    expect(result.schemaVersion).toBe('1.0');
    expect(result.data.setup.aantalMensen).toBe(4);
    expect(result.data.setup.aantalVolwassen).toBe(2);
  });

  it('moet fallback waarden gebruiken bij corrupte oude data', async () => {
    const result = await migrateTransactionsToPhoenix(null);
    
    expect(result.data.setup.aantalMensen).toBe(0);
    expect(result.schemaVersion).toBe('1.0');
  });
});