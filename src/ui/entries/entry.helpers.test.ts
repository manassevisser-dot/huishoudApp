// src/ui/entries/entry.helpers.test.ts
import {
  getEmptyStyle,
  toStyleRule,
  toStringValue,
  toNumberValue,
  toBooleanValue,
  toBaseViewModel,
} from './entry.helpers';
import type { PrimitiveStyleRule } from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import { PRIMITIVE_TYPES } from '@ui/kernel';

describe('entry helpers', () => {
  describe('getEmptyStyle', () => {
    it('should return an empty style object', () => {
      const result = getEmptyStyle();
      expect(result).toEqual({});
    });

    it('should return the same reference each time (singleton)', () => {
      const result1 = getEmptyStyle();
      const result2 = getEmptyStyle();
      expect(result1).toBe(result2); // Same object reference
    });
  });

  describe('toStyleRule', () => {
    it('should return the style object when input is a valid object', () => {
      const style = { margin: 10, padding: 5, color: 'red' };
      const result = toStyleRule(style);
      expect(result).toBe(style);
    });

    it('should return empty style for null input', () => {
      const result = toStyleRule(null);
      expect(result).toEqual({});
    });

    it('should return empty style for undefined input', () => {
      const result = toStyleRule(undefined);
      expect(result).toEqual({});
    });

    it('should return empty style for primitive values', () => {
      expect(toStyleRule(42)).toEqual({});
      expect(toStyleRule('string')).toEqual({});
      expect(toStyleRule(true)).toEqual({});
    });

    it('should return empty style for string input without styles param', () => {
      expect(toStyleRule('primitive:counter')).toEqual({});
      expect(toStyleRule('entry:someId')).toEqual({});
    });

    it('should resolve string input via fallbackKey when styles param is provided', () => {
      const mockStyles = {
        inputContainer: { marginBottom: 16, width: '100%' },
        entryLabel: { fontSize: 16, fontWeight: '600' },
      } as any;

      const result = toStyleRule('primitive:counter', mockStyles, 'inputContainer');
      expect(result).toBe(mockStyles.inputContainer);
    });

    it('should return empty style when fallbackKey is missing from styles', () => {
      const mockStyles = { inputContainer: { marginBottom: 16 } } as any;
      // 'entryLabel' bestaat niet in deze mock
      const result = toStyleRule('some-string', mockStyles, 'entryLabel' as any);
      expect(result).toEqual({});
    });

    it('should return empty style when styles param is provided but fallbackKey is undefined', () => {
      const mockStyles = { inputContainer: { marginBottom: 16 } } as any;
      const result = toStyleRule('primitive:counter', mockStyles, undefined);
      expect(result).toEqual({});
    });

    it('should prefer object input over fallbackKey when input is an object', () => {
      const directStyle = { padding: 8 };
      const mockStyles = { inputContainer: { marginBottom: 16 } } as any;
      const result = toStyleRule(directStyle, mockStyles, 'inputContainer');
      // object-input heeft altijd prioriteit
      expect(result).toBe(directStyle);
    });

    it('should return empty style for arrays', () => {
      expect(toStyleRule([1, 2, 3])).toEqual({});
    });

    it('should return empty style for functions', () => {
      expect(toStyleRule(() => {})).toEqual({});
    });

    it('should handle complex nested objects', () => {
      const style = {
        margin: 10,
        padding: { top: 5, bottom: 5 },
        border: { width: 1, color: 'black' },
      };
      const result = toStyleRule(style);
      expect(result).toBe(style);
    });
  });

  describe('toStringValue', () => {
    it('should return the string value when input is a string', () => {
      expect(toStringValue('hello')).toBe('hello');
      expect(toStringValue('')).toBe('');
    });

    it('should return empty string for non-string values', () => {
      expect(toStringValue(42)).toBe('');
      expect(toStringValue(true)).toBe('');
      expect(toStringValue(null)).toBe('');
      expect(toStringValue(undefined)).toBe('');
      expect(toStringValue({})).toBe('');
      expect(toStringValue([])).toBe('');
    });

    it('should handle number 0 correctly', () => {
      expect(toStringValue(0)).toBe('');
    });
  });

  describe('toNumberValue', () => {
    it('should return the number value when input is a finite number', () => {
      expect(toNumberValue(42)).toBe(42);
      expect(toNumberValue(0)).toBe(0);
      expect(toNumberValue(-10)).toBe(-10);
      expect(toNumberValue(3.14)).toBe(3.14);
    });

    it('should return 0 for non-number values', () => {
      expect(toNumberValue('42')).toBe(0);
      expect(toNumberValue(true)).toBe(0);
      expect(toNumberValue(null)).toBe(0);
      expect(toNumberValue(undefined)).toBe(0);
      expect(toNumberValue({})).toBe(0);
      expect(toNumberValue([])).toBe(0);
    });

    it('should return 0 for infinite numbers', () => {
      expect(toNumberValue(Infinity)).toBe(0);
      expect(toNumberValue(-Infinity)).toBe(0);
      expect(toNumberValue(NaN)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(toNumberValue(Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
      expect(toNumberValue(Number.MIN_VALUE)).toBe(Number.MIN_VALUE);
    });
  });

  describe('toBooleanValue', () => {
    it('should return true when input is exactly true', () => {
      expect(toBooleanValue(true)).toBe(true);
    });

    it('should return false for all other values', () => {
      expect(toBooleanValue(false)).toBe(false);
      expect(toBooleanValue(1)).toBe(false);
      expect(toBooleanValue(0)).toBe(false);
      expect(toBooleanValue('true')).toBe(false);
      expect(toBooleanValue(null)).toBe(false);
      expect(toBooleanValue(undefined)).toBe(false);
      expect(toBooleanValue({})).toBe(false);
      expect(toBooleanValue([])).toBe(false);
    });

    it('should handle truthy values correctly', () => {
      // Alleen true is true, al het andere is false
      expect(toBooleanValue('hello')).toBe(false);
      expect(toBooleanValue(42)).toBe(false);
      expect(toBooleanValue({})).toBe(false);
    });
  });

  describe('toBaseViewModel', () => {
    const mockEntry: RenderEntryVM = {
      entryId: 'test-entry',
      fieldId: 'test-field',
      label: 'Test Label',
      placeholder: 'Test Placeholder',
      primitiveType: PRIMITIVE_TYPES.TEXT,
      value: 'test value',
      isVisible: true,
      options: ['opt1', 'opt2'],
      optionsKey: 'test-options',
      style: { margin: 10 },
      childStyle: { padding: 5 },
      onChange: jest.fn(),
    };

    it('should create base view model for TEXT primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.TEXT);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.TEXT,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for CURRENCY primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.CURRENCY);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.CURRENCY,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for DATE primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.DATE);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.DATE,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for NUMBER primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.NUMBER);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.NUMBER,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for COUNTER primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.COUNTER);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.COUNTER,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for TOGGLE primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.TOGGLE);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.TOGGLE,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for CHIP_GROUP primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.CHIP_GROUP);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for RADIO primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.RADIO);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.RADIO,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for ACTION primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.ACTION);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.ACTION,
        error: null,
        errorStyle: {},
      });
    });

    it('should create base view model for LABEL primitive', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.LABEL);

      expect(result).toEqual({
        fieldId: 'test-field',
        primitiveType: PRIMITIVE_TYPES.LABEL,
        error: null,
        errorStyle: {},
      });
    });

    it('should use fieldId from entry', () => {
      const entryWithDifferentField = {
        ...mockEntry,
        fieldId: 'custom-field-id',
      };
      const result = toBaseViewModel(entryWithDifferentField, PRIMITIVE_TYPES.TEXT);
      expect(result.fieldId).toBe('custom-field-id');
    });

    it('should ignore other entry properties', () => {
      const result = toBaseViewModel(mockEntry, PRIMITIVE_TYPES.TEXT);
      
      // Deze properties mogen NIET in de base view model zitten
      expect(result).not.toHaveProperty('label');
      expect(result).not.toHaveProperty('placeholder');
      expect(result).not.toHaveProperty('value');
      expect(result).not.toHaveProperty('isVisible');
      expect(result).not.toHaveProperty('options');
      expect(result).not.toHaveProperty('style');
      expect(result).not.toHaveProperty('childStyle');
      expect(result).not.toHaveProperty('onChange');
    });
  });
});