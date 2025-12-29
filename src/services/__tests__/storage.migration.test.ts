import { migrateToPhoenix } from '../transactionService';

describe('Storage Migration', () => {
  it('should run migration without errors', async () => {
    // Onze nieuwe migrateToPhoenix verwacht 0 argumenten
    const result = await migrateToPhoenix();
    expect(result).toBe(true);
  });
});