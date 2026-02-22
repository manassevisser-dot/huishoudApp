import { migrateTransactionsToPhoenix } from '../transactionService';
import { FormState } from '@core/types/core';

describe('Storage Migration: V0 to Phoenix', () => {
  it('moet oude setup data migreren naar de nieuwe data.setup nesting', async () => {
    // 1. Arrange: Oude data structuur
    const oldData = {
      setup: {
        aantalMensen: 4,
        aantalVolwassen: 2,
        autoCount: 'Een',
      },
      household: {
        leden: [],
      },
    };

    // 2. Act: Geef de 'oldData' mee (niet null!)
    const result = (await migrateTransactionsToPhoenix(oldData)) as unknown as FormState;

    // 3. Assert: Nu zal de 'received' waarde netjes 4 zijn
    expect(result).toBeDefined();
    expect(result.schemaVersion).toBe('1.0');
    expect(result.data.setup.aantalMensen).toBe(4);
    expect(result.data.setup.aantalVolwassen).toBe(2);
    expect(result.meta.version).toBeDefined();
  });

  it('moet fallback waarden gebruiken bij corrupte oude data', async () => {
    // Act: Hier is 'null' juist WEL de bedoeling om de fallback te testen
    const result = (await migrateTransactionsToPhoenix(null)) as unknown as FormState;

    // Assert
    expect(result.schemaVersion).toBe('1.0');
    expect(result.data.setup.aantalMensen).toBe(0); // Verwacht 0 bij null input
    expect(result.data.household.members).toBeDefined();
  });
});
