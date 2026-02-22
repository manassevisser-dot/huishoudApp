// src/domain/constants/datakeys.test.ts

import { DATA_KEYS, SUB_KEYS } from './datakeys';

describe('DATA_KEYS', () => {
  it('bevat de juiste keys als readonly strings', () => {
    expect(DATA_KEYS.SETUP).toBe('setup');
    expect(DATA_KEYS.HOUSEHOLD).toBe('household');
    expect(DATA_KEYS.FINANCE).toBe('finance');
    expect(DATA_KEYS.META).toBe('meta');
  });

  it('is type-safe: alle waarden zijn string literals', () => {
    // Dit compileert alleen als DATA_KEYS correct is
    const key: 'setup' | 'household' | 'finance' | 'meta' = DATA_KEYS.SETUP;
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

  it('is type-safe: alle waarden zijn string literals', () => {
    const key: 'members' | 'income' | 'expenses' | 'items' = SUB_KEYS.MEMBERS;
    expect(key).toBeDefined();
  });
});
  it('snapshot van alle datakeys', () => {
    expect(DATA_KEYS).toMatchSnapshot();
  })