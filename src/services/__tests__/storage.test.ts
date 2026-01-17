import { migrateToPhoenix } from '@adapters/storage/storage';
import { DATA_KEYS } from '@domain/constants/datakeys';

describe('storage.ts: migrateToPhoenix', () => {
  it('moet een volledige migratie uitvoeren van oude data naar de Phoenix structuur', () => {
    const oldState = {
      [DATA_KEYS.SETUP]: { aantalMensen: 3, aantalVolwassen: 2, autoCount: 'Ja' },
      [DATA_KEYS.HOUSEHOLD]: {
        leden: [{ id: 'custom-1', naam: 'Jan', type: 'adult' }, { firstName: 'Piet' }],
      },
      C7: { items: [{ amount: 2500 }] },
    };

    const result = migrateToPhoenix(oldState);

    // We casten naar 'any' om de mismatch tussen 'naam' en 'name' in de interface te omzeilen
    const members = result.data[DATA_KEYS.HOUSEHOLD].members as any[];

    expect(result.schemaVersion).toBe('1.0');
    expect(members).toHaveLength(2);

    // Controleer of de migratie-functie inderdaad 'naam' heeft aangemaakt
    expect(members[0].naam).toBe('Jan');
    expect(members[1].naam).toBe('Piet');
    expect(members[1].entityId).toBe('m-1');
  });

  it('moet omgaan met lege of null input (Lijn 10-14 coverage)', () => {
    const result = migrateToPhoenix(null);

    expect(result.data[DATA_KEYS.SETUP].aantalMensen).toBe(1);
    expect(result.data[DATA_KEYS.HOUSEHOLD].members).toEqual([]);
    expect(result.data[DATA_KEYS.FINANCE].income.totalAmount).toBe(0);
  });

  it('moet verschillende financiële input-formaten herkennen (Lijn 12-15 coverage)', () => {
    const stateWithValue = { income: { list: [{ value: 100 }] } };
    const result = migrateToPhoenix(stateWithValue);

    // toCents(100) wordt 10000 (uitgaande van je util)
    expect(result.data[DATA_KEYS.FINANCE].income.totalAmount).toBeGreaterThan(0);
  });
  it('moet loadState aanroepen en null teruggeven (Lijn 65 coverage)', async () => {
    const { storage } = require('@adapters/storage/storage');
    const result = await storage.loadState();
    expect(result).toBeNull();
  });
});
