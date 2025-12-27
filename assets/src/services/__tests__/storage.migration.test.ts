import { Storage, SCHEMA_VERSION } from '../storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('WAI-005B: Migration Matrix (Legacy -> Phoenix)', () => {
  it('moet v0 (plat object) met floats correct migreren naar v2 centen', async () => {
    const legacyV0 = {
      C7: { list: [{ id: '1', value: 12.5 }] }, // 12,50 euro
      C10: { items: [{ id: '2', amount: 50 }] }, // 50 cent (integer)
    };

    await AsyncStorage.setItem('@CashflowWizardState', JSON.stringify(legacyV0));
    const migrated = await Storage.loadState();

    expect(migrated?.schemaVersion).toBe('1.0');
    // 12.50 float wordt 1250 cent
    expect(migrated?.C7?.items[0].amount).toBe(1250);
    // 50 integer blijft 50 cent (conform nieuwe heuristiek)
    expect(migrated?.C10?.items[0].amount).toBe(50);
  });

  it('moet strings ("10,50") via de NumericParser omzetten naar centen', async () => {
    const legacyData = {
      C7: { items: [{ id: '3', amount: '10,50' }] },
    };

    await AsyncStorage.setItem('@CashflowWizardState', JSON.stringify(legacyData));
    const migrated = await Storage.loadState();

    expect(migrated?.C7?.items[0].amount).toBe(1050);
  });
});
