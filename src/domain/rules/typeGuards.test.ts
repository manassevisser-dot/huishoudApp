// src/domain/rules/visibility.typeGuards.test.ts
import { isEmpty, isNumeric } from '@domain/rules/typeGuards'; // ⬅️ pas aan naar jouw bronbestand

describe('visibility.typeGuards: isEmpty', () => {
  test('null en undefined zijn empty', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  test('strings: lege en whitespace-only zijn empty; overige niet', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('   ')).toBe(true);
    expect(isEmpty('\n\t')).toBe(true);

    expect(isEmpty('0')).toBe(false);
    expect(isEmpty(' false ')).toBe(false);
    expect(isEmpty('abc')).toBe(false);
  });

  test('arrays: [] is empty; met elementen niet', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty([null])).toBe(false); // heeft element → niet leeg
  });

  test('objects: {} is empty; met properties niet', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty({ a: undefined })).toBe(false); // key bestaat → niet leeg
  });

  test('overige types: numbers/booleans/functions zijn niet empty', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(NaN)).toBe(false);
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(() => {})).toBe(false);
  });
});

describe('visibility.typeGuards: isNumeric', () => {
  test('numbers: alleen finite numbers zijn numeric', () => {
    expect(isNumeric(0)).toBe(true);
    expect(isNumeric(123)).toBe(true);
    expect(isNumeric(-5.25)).toBe(true);

    expect(isNumeric(NaN)).toBe(false);
    expect(isNumeric(Infinity)).toBe(false);
    expect(isNumeric(-Infinity)).toBe(false);
  });

  test('strings: trims whitespace; lege string is niet numeric', () => {
    expect(isNumeric('')).toBe(false);
    expect(isNumeric('   ')).toBe(false);

    expect(isNumeric(' 0 ')).toBe(true);
    expect(isNumeric('  42')).toBe(true);
    expect(isNumeric('0037')).toBe(true);
    expect(isNumeric('-12.34')).toBe(true);
  });

  test('strings: niet‑getal formats zijn niet numeric', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('12a')).toBe(false);
    expect(isNumeric('1_000')).toBe(false); // underscore niet toegestaan door Number()
    expect(isNumeric('1,000')).toBe(false); // locale komma niet toegestaan door Number()
  });

  test('booleans/objects/arrays/functions zijn niet numeric', () => {
    expect(isNumeric(true)).toBe(false);
    expect(isNumeric(false)).toBe(false);
    expect(isNumeric({})).toBe(false);
    expect(isNumeric([])).toBe(false);
    expect(isNumeric([123])).toBe(false);
    expect(isNumeric(() => 1)).toBe(false);
  });
});