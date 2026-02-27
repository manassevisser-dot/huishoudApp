// src/domain/constants/datakeys.test.ts
import { DATA_KEYS, SUB_KEYS } from 'C:/Users/manas/huishoudApp/src/domain/constants/datakeys';

describe('DATA_KEYS', () => {
  it('bevat de juiste keys als readonly strings', () => {
    expect(DATA_KEYS.SETUP).toBe('setup');
    expect(DATA_KEYS.HOUSEHOLD).toBe('household');
    expect(DATA_KEYS.FINANCE).toBe('finance');
    expect(DATA_KEYS.META).toBe('meta');
    expect(DATA_KEYS.LATEST_TRANSACTION).toBe('latestTransaction');
    expect(DATA_KEYS.CSV_IMPORT).toBe('csvImport');
  });

  it('bevat precies 6 keys', () => {
    const keys = Object.keys(DATA_KEYS);
    expect(keys).toHaveLength(6);
  });

  it('is type-safe: waarden zijn string literals', () => {
    const key: 'setup' | 'household' | 'finance' | 'meta' | 'latestTransaction' | 'csvImport' =
      DATA_KEYS.SETUP;
    expect(key).toBeDefined();
  });
});

describe('SUB_KEYS', () => {
  it('bevat de juiste sub-keys als readonly strings', () => {
    expect(SUB_KEYS.MEMBERS).toBe('members');
    expect(SUB_KEYS.INCOME).toBe('income');
    expect(SUB_KEYS.EXPENSES).toBe('expenses');
    expect(SUB_KEYS.ITEMS).toBe('items');
  });

  it('bevat precies 4 sub-keys', () => {
    const keys = Object.keys(SUB_KEYS);
    expect(keys).toHaveLength(4);
  });

  it('is type-safe: waarden zijn string literals', () => {
    const key: 'members' | 'income' | 'expenses' | 'items' = SUB_KEYS.MEMBERS;
    expect(key).toBeDefined();
  });
});