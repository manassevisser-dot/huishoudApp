// src/ui/entries/entry.mappers.test.ts
import {
  toCurrencyViewModel,
  toDateViewModel,
  toTextViewModel,
  toNumberViewModel,
  toCounterViewModel,
  toToggleViewModel,
  toChipGroupViewModel,
  toRadioViewModel,
  toActionViewModel,
  toLabelViewModel,
} from './entry.mappers';
import { PRIMITIVE_TYPES } from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import * as helpers from './entry.helpers';

// Mock helpers
jest.mock('./entry.helpers', () => ({
  getEmptyStyle: jest.fn().mockReturnValue({ empty: true }),
  toStyleRule: jest.fn().mockImplementation((style) => ({ ...style, styled: true })),
  toStringValue: jest.fn().mockImplementation((value) => value?.toString() ?? ''),
  toNumberValue: jest.fn().mockImplementation((value) => Number(value) || 0),
  toBooleanValue: jest.fn().mockImplementation((value) => Boolean(value)),
  toBaseViewModel: jest.fn().mockImplementation((entry, type) => ({
    fieldId: entry.fieldId,
    entryId: entry.entryId,
    primitiveType: type,
    isVisible: entry.isVisible,
  })),
}));

describe('entry mappers', () => {
  // Mock data
  const mockEntry: RenderEntryVM = {
    entryId: 'test-entry',
    fieldId: 'test-field',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    primitiveType: PRIMITIVE_TYPES.TEXT,
    value: 'test value',
    isVisible: true,
    options: ['opt1', 'opt2', 'opt3'],
    optionsKey: 'test-options',
    style: { margin: 10 },
    childStyle: { padding: 5 },
    onChange: jest.fn(),
  };

  const mockEntryWithNumberValue: RenderEntryVM = {
    ...mockEntry,
    value: 42,
  };

  const mockEntryWithBooleanValue: RenderEntryVM = {
    ...mockEntry,
    value: true,
  };

  const mockEntryWithoutOptions: RenderEntryVM = {
    ...mockEntry,
    options: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toCurrencyViewModel', () => {
    it('should map to CurrencyViewModel correctly', () => {
      const result = toCurrencyViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.CURRENCY);
      expect(helpers.toStringValue).toHaveBeenCalledWith(mockEntry.value);
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.childStyle);
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.style);

      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.CURRENCY,
        isVisible: true,
        label: 'Test Label',
        value: "test value",
        placeholder: 'Test Placeholder',
        containerStyle: { padding: 5, styled: true },
        labelStyle: { margin: 10, styled: true },
        onCurrencyChange: expect.any(Function),
      });
    });

    it('should call onChange when onCurrencyChange is triggered', () => {
      const result = toCurrencyViewModel(mockEntry);
      result.onCurrencyChange('new value');
      expect(mockEntry.onChange).toHaveBeenCalledWith('new value');
    });
  });

  describe('toDateViewModel', () => {
    it('should map to DateViewModel correctly', () => {
      const result = toDateViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.DATE);
      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.DATE,
        isVisible: true,
        label: 'Test Label',
        value: "test value",
        containerStyle: { padding: 5, styled: true },
        labelStyle: { margin: 10, styled: true },
        onDateChange: expect.any(Function),
      });
    });

    it('should call onChange when onDateChange is triggered', () => {
      const result = toDateViewModel(mockEntry);
      result.onDateChange('2024-01-01');
      expect(mockEntry.onChange).toHaveBeenCalledWith('2024-01-01');
    });
  });

  describe('toTextViewModel', () => {
    it('should map to TextViewModel correctly', () => {
      const result = toTextViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.TEXT);
      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.TEXT,
        isVisible: true,
        label: 'Test Label',
        value: "test value",
        placeholder: 'Test Placeholder',
        containerStyle: { padding: 5, styled: true },
        labelStyle: { margin: 10, styled: true },
        onTextChange: expect.any(Function),
      });
    });

    it('should call onChange when onTextChange is triggered', () => {
      const result = toTextViewModel(mockEntry);
      result.onTextChange('new text');
      expect(mockEntry.onChange).toHaveBeenCalledWith('new text');
    });
  });

  describe('toNumberViewModel', () => {
    it('should map to NumberViewModel correctly', () => {
      const result = toNumberViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.NUMBER);
      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.NUMBER,
        isVisible: true,
        label: 'Test Label',
        value: "test value",
        placeholder: 'Test Placeholder',
        containerStyle: { padding: 5, styled: true },
        labelStyle: { margin: 10, styled: true },
        onNumberChange: expect.any(Function),
      });
    });

    it('should call onChange when onNumberChange is triggered', () => {
      const result = toNumberViewModel(mockEntry);
      result.onNumberChange('42');
      expect(mockEntry.onChange).toHaveBeenCalledWith('42');
    });
  });

  describe('toCounterViewModel', () => {
    it('should map to CounterViewModel correctly', () => {
      const result = toCounterViewModel(mockEntryWithNumberValue);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntryWithNumberValue, PRIMITIVE_TYPES.COUNTER);
      expect(helpers.toNumberValue).toHaveBeenCalledWith(42);
      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.COUNTER,
        isVisible: true,
        label: 'Test Label',
        value: 42,
        containerStyle: { padding: 5, styled: true },
        labelStyle: { margin: 10, styled: true },
        onCounterChange: expect.any(Function),
      });
    });

    it('should handle undefined value', () => {
      const entryWithUndefined = { ...mockEntry, value: undefined };
      const result = toCounterViewModel(entryWithUndefined);
      expect(result.value).toBe(0);
    });

    it('should call onChange when onCounterChange is triggered', () => {
      const result = toCounterViewModel(mockEntryWithNumberValue);
      result.onCounterChange(99);
      expect(mockEntry.onChange).toHaveBeenCalledWith(99);
    });
  });

  describe('toToggleViewModel', () => {
    it('should map to ToggleViewModel correctly', () => {
      const result = toToggleViewModel(mockEntryWithBooleanValue);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntryWithBooleanValue, PRIMITIVE_TYPES.TOGGLE);
      expect(helpers.toBooleanValue).toHaveBeenCalledWith(true);
      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.TOGGLE,
        isVisible: true,
        label: 'Test Label',
        value: true,
        labelTrue: 'Ja',
        labelFalse: 'Nee',
        containerStyle: { padding: 5, styled: true },
        labelStyle: { margin: 10, styled: true },
        onToggle: expect.any(Function),
      });
    });

    it('should handle false value', () => {
      const entryWithFalse = { ...mockEntry, value: false };
      const result = toToggleViewModel(entryWithFalse);
      expect(result.value).toBe(false);
    });

    it('should call onChange when onToggle is triggered', () => {
      const result = toToggleViewModel(mockEntryWithBooleanValue);
      result.onToggle(false);
      expect(mockEntry.onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('toChipGroupViewModel', () => {
    it('should map to ChipGroupViewModel correctly', () => {
      const result = toChipGroupViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.CHIP_GROUP);
      expect(helpers.toStringValue).toHaveBeenCalledWith('test value');
      expect(helpers.getEmptyStyle).toHaveBeenCalled();
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.style);
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.childStyle);

      expect(result.label).toBe('Test Label');
      expect(result.chips).toHaveLength(3);
      
      // Check eerste chip
      expect(result.chips[0]).toEqual({
        label: 'opt1',
        selected: false,
        containerStyle: { empty: true },
        textStyle: { empty: true },
        onPress: expect.any(Function),
        accessibilityLabel: 'opt1',
        accessibilityState: { selected: false },
      });

      // Check dat de geselecteerde chip klopt
      const entryWithSelected = { ...mockEntry, value: 'opt2' };
      const resultWithSelected = toChipGroupViewModel(entryWithSelected);
      expect(resultWithSelected.chips[1].selected).toBe(true);
      expect(resultWithSelected.chips[1].accessibilityState).toEqual({ selected: true });
    });

    it('should handle empty options array', () => {
      const result = toChipGroupViewModel(mockEntryWithoutOptions);
      expect(result.chips).toEqual([]);
    });

    it('should call onChange when chip is pressed', () => {
      const result = toChipGroupViewModel(mockEntry);
      result.chips[0].onPress();
      expect(mockEntry.onChange).toHaveBeenCalledWith('opt1');
    });
  });

  describe('toRadioViewModel', () => {
    it('should map to RadioViewModel correctly', () => {
      const result = toRadioViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.RADIO);
      expect(helpers.toStringValue).toHaveBeenCalledWith('test value');
      expect(helpers.getEmptyStyle).toHaveBeenCalled();
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.style);
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.childStyle);

      expect(result.label).toBe('Test Label');
      expect(result.options).toHaveLength(3);
      
      // Check eerste optie
      expect(result.options[0]).toEqual({
        label: 'opt1',
        value: 'opt1',
        selected: false,
        onSelect: expect.any(Function),
      });

      // Check dat de geselecteerde optie klopt
      const entryWithSelected = { ...mockEntry, value: 'opt2' };
      const resultWithSelected = toRadioViewModel(entryWithSelected);
      expect(resultWithSelected.options[1].selected).toBe(true);
    });

    it('should handle empty options array', () => {
      const result = toRadioViewModel(mockEntryWithoutOptions);
      expect(result.options).toEqual([]);
    });

    it('should call onChange when option is selected', () => {
      const result = toRadioViewModel(mockEntry);
      result.options[0].onSelect();
      expect(mockEntry.onChange).toHaveBeenCalledWith('opt1');
    });
  });

  describe('toActionViewModel', () => {
    it('should map to ActionViewModel correctly', () => {
      const result = toActionViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.ACTION);
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.style);

      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.ACTION,
        isVisible: true,
        label: 'Test Label',
        containerStyle: { margin: 10, styled: true },
        onPress: expect.any(Function),
      });
    });

    it('should call onChange with null when onPress is triggered', () => {
      const result = toActionViewModel(mockEntry);
      result.onPress();
      expect(mockEntry.onChange).toHaveBeenCalledWith(null);
    });
  });

  describe('toLabelViewModel', () => {
    it('should map to LabelViewModel correctly', () => {
      const result = toLabelViewModel(mockEntry);

      expect(helpers.toBaseViewModel).toHaveBeenCalledWith(mockEntry, PRIMITIVE_TYPES.LABEL);
      expect(helpers.toStringValue).toHaveBeenCalledWith('test value');
      expect(helpers.getEmptyStyle).toHaveBeenCalled();
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.style);
      expect(helpers.toStyleRule).toHaveBeenCalledWith(mockEntry.childStyle);

      expect(result).toEqual({
        fieldId: 'test-field',
        entryId: 'test-entry',
        primitiveType: PRIMITIVE_TYPES.LABEL,
        isVisible: true,
        label: 'Test Label',
        value: 'test value',
        containerStyle: { margin: 10, styled: true },
        labelStyle: { empty: true },
        valueStyle: { padding: 5, styled: true },
      });
    });

    it('should handle undefined value', () => {
      const entryWithUndefined = { ...mockEntry, value: undefined };
      const result = toLabelViewModel(entryWithUndefined);
      expect(result.value).toBe('');
    });
  });
});