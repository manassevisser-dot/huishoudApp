import { migrateToPhoenix } from '../migrationService';
import { DATA_KEYS, SUB_KEYS } from '@domain/constants/datakeys';

describe('migrationService - migrateToPhoenix', () => {
  
  test('should return base state when input is null or undefined', async () => {
    const resultNull = await migrateToPhoenix(null);
    const resultUndef = await migrateToPhoenix(undefined);

    expect(resultNull.activeStep).toBe('LANDING');
    expect(resultNull.meta.lastModified).toBeDefined();
    expect(resultUndef.data[DATA_KEYS.HOUSEHOLD].members).toEqual([]);
  });

  test('should migrate legacy "leden" array and split names correctly', async () => {
    const oldData = {
      leden: [
        { naam: 'Jan Jansen', memberType: 'adult' },
        { naam: 'Kleine Piet', memberType: 'child', age: 8 }
      ]
    };

    const result = await migrateToPhoenix(oldData);
    const members = result.data[DATA_KEYS.HOUSEHOLD].members;

    expect(members).toHaveLength(2);
    expect(members[0].firstName).toBe('Jan');
    expect(members[0].lastName).toBe('Jansen');
    expect(members[1].firstName).toBe('Kleine');
    expect(members[1].lastName).toBe('Piet');
    expect(members[1].age).toBe(8);
  });

  test('should use default ages when age is missing', async () => {
    const oldData = {
      household: {
        members: [
          { fullName: 'Volwassene', memberType: 'adult' },
          { fullName: 'Kind', memberType: 'child' }
        ]
      }
    };

    const result = await migrateToPhoenix(oldData);
    const members = result.data[DATA_KEYS.HOUSEHOLD].members;

    expect(members[0].age).toBe(35); // Default adult
    expect(members[1].age).toBe(10); // Default child
  });

  test('should map setup data and finance items correctly', async () => {
    const oldData = {
      aantalMensen: 4,
      aantalVolwassen: 2,
      income: { items: [{ label: 'Salaris', amount: 3000 }] },
      expenses: { items: [{ label: 'Huur', amount: 1000 }] },
      metadata: { schemaVersion: '0.9', migratedAt: '2023-01-01T00:00:00Z' }
    };

    const result = await migrateToPhoenix(oldData);

    expect(result.data[DATA_KEYS.SETUP].aantalMensen).toBe(4);
    expect(result.data[DATA_KEYS.FINANCE][SUB_KEYS.INCOME].items).toHaveLength(1);
    expect(result.meta.version).toBe(0.9);
    expect(result.meta.lastModified).toBe('2023-01-01T00:00:00Z');
  });

  test('should fallback to base setup values when old data is missing numbers', async () => {
    const oldData = {
      aantalMensen: null,
      // Geen aantalVolwassen
    };

    const result = await migrateToPhoenix(oldData as any);
    // Controleer of het niet crasht en terugvalt op base defaults
    expect(result.data[DATA_KEYS.SETUP].autoCount).toBe('Nee');
  });
});