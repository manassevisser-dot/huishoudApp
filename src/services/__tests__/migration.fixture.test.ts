// src/services/__tests__/migration.fixture.test.ts
import { LegacyStateFixture, LegacyLedenPhoenixMigrationFixture } from '@test-utils/fixtures';
import { migrateTransactionsToPhoenix } from '@services/transactionService';

describe('Legacy → Phoenix migratie (leden → members)', () => {
  // 1. Maak de test 'async'
  it('zet household.leden om naar data.household.members', async () => {
    
    // 2. Gebruik 'await' bij de aanroep. 
    // Als het een fixture is, wrappen we het in Promise.resolve zodat 'await' altijd werkt.
    const migrated = migrateTransactionsToPhoenix
      ? await migrateTransactionsToPhoenix(LegacyStateFixture as any)
      : await Promise.resolve(LegacyLedenPhoenixMigrationFixture); 

    // Nu weet TypeScript 100% zeker dat 'migrated' de FormState is en geen Promise
    const members = migrated.data.household.members;
    
    expect(members).toHaveLength(2);
    expect(members[0]).toMatchObject({ entityId: 'm1', memberType: 'adult' });
    expect(members[1]).toMatchObject({ entityId: 'm2', memberType: 'child' });
    expect(migrated.schemaVersion).toBe('1.0');
  });
});