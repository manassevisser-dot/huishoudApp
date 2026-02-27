// src/ui/entries/entries.components.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TouchableOpacity, Switch } from 'react-native';
import {
  MoneyEntry,
  DateEntry,
  TextEntry,
  NumberEntry,
  CounterEntry,
  ToggleEntry,
  ChipGroupEntry,
  RadioEntry,
  ActionEntry,
  LabelEntry,
} from './entries.components';

// Mocks voor de primitives
jest.mock('@ui/primitives/primitives', () => {
  const { View, Text, TouchableOpacity, Switch } = require('react-native');

  return {
    InputPrimitive: jest.fn(({ value, onAction, placeholder, keyboardType, style }) => (
      <View testID="input-primitive" data-value={value} data-placeholder={placeholder} data-keyboardtype={keyboardType} data-style={JSON.stringify(style)}>
        <Text onPress={() => onAction?.('changed')}>{value || placeholder || ''}</Text>
      </View>
    )),

    CounterPrimitive: jest.fn(({ value, onCounterChange, style }) => (
      <View testID="counter-primitive" data-value={value} data-style={JSON.stringify(style)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => onCounterChange?.(value - 1)}><Text>-</Text></TouchableOpacity>
        <Text style={{ marginHorizontal: 15 }}>{value}</Text>
        <TouchableOpacity onPress={() => onCounterChange?.(value + 1)}><Text>+</Text></TouchableOpacity>
      </View>
    )),

    TogglePrimitive: jest.fn(({ value, onToggle, style }) => (
      <View testID="toggle-primitive" data-value={value} data-style={JSON.stringify(style)}>
        <Switch value={value} onValueChange={onToggle} />
      </View>
    )),

    ChipPrimitive: jest.fn(({ label, selected, onPress, containerStyle, textStyle, accessibilityLabel }) => (
      <TouchableOpacity
        testID={`chip-${label}`}
        data-label={label}
        data-selected={selected}
        data-accessibilitylabel={accessibilityLabel}
        data-containerstyle={JSON.stringify(containerStyle)}
        data-textstyle={JSON.stringify(textStyle)}
        onPress={onPress}
        style={containerStyle}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    )),

    RadioOptionPrimitive: jest.fn(({ label, selected, onSelect }) => (
      <TouchableOpacity
        testID={`radio-${label}`}
        data-label={label}
        data-selected={selected}
        onPress={() => onSelect?.()}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2, marginRight: 10, alignItems: 'center', justifyContent: 'center' }}>
          {selected && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#000' }} />}
        </View>
        <Text>{label}</Text>
      </TouchableOpacity>
    )),

    DatePrimitive: jest.fn(({ value, onDateChange, style }) => (
      <View testID="date-primitive" data-value={value} data-style={JSON.stringify(style)}>
        <TouchableOpacity onPress={() => onDateChange?.(new Date('2024-01-01'))}>
          <Text>{value || 'Kies datum'}</Text>
        </TouchableOpacity>
      </View>
    )),

    LabelPrimitive: jest.fn(({ label, value, style, labelStyle, valueStyle }) => (
      <View
        testID="label-primitive"
        data-label={label}
        data-value={value}
        data-style={JSON.stringify(style)}
        data-labelstyle={JSON.stringify(labelStyle)}
        data-valuestyle={JSON.stringify(valueStyle)}
        style={style}
      >
        <Text style={labelStyle}>{label}</Text>
        <Text style={valueStyle}>{value}</Text>
      </View>
    )),

    ButtonPrimitive: jest.fn(({ label, onPress, style, textStyle }) => (
      <TouchableOpacity
        testID="button-primitive"
        data-label={label}
        data-style={JSON.stringify(style)}
        onPress={onPress}
        style={style}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    )),
  };
});

// Helpers: React 18 roept mock-components aan als gewone functies.
// calls[0][1] en calls[0][2] zijn altijd undefined.
// toHaveBeenCalledWith(..., expect.anything()) faalt hierop.
// Gebruik altijd mock.calls[0][0] om alleen de props te inspecteren.
const getMock = (name: string): jest.Mock =>
  (jest.requireMock('@ui/primitives/primitives') as Record<string, jest.Mock>)[name];

const getProps = (name: string): Record<string, unknown> =>
  getMock(name).mock.calls[0][0] as Record<string, unknown>;

describe('Entry Components', () => {
  const mockOnChange = jest.fn();
  const mockOnPress = jest.fn();

  const baseViewModel = {
    containerStyle: { padding: 10 },
    labelStyle: { fontSize: 16 },
    errorStyle: { color: 'red' },
    error: undefined,
    label: 'Test Label',
    primitiveType: 'test' as any,
    fieldId: 'test-field' as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('FieldWrapper', () => {
    it('should render label when provided', () => {
      const viewModel = {
        ...baseViewModel,
        value: '100',
        onCurrencyChange: mockOnChange,
        placeholder: 'Enter amount',
      } as any;

      const { getByText } = render(<MoneyEntry viewModel={viewModel} />);
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('should not render label when empty string', () => {
      const viewModel = {
        ...baseViewModel,
        label: '',
        value: '100',
        onCurrencyChange: mockOnChange,
        placeholder: 'Enter amount',
      } as any;

      const { queryByText } = render(<MoneyEntry viewModel={viewModel} />);
      expect(queryByText('Test Label')).toBeNull();
    });

    it('should render error when provided', () => {
      const viewModel = {
        ...baseViewModel,
        error: 'Invalid amount',
        value: '100',
        onCurrencyChange: mockOnChange,
        placeholder: 'Enter amount',
      } as any;

      const { getByText } = render(<MoneyEntry viewModel={viewModel} />);
      expect(getByText('Invalid amount')).toBeTruthy();
    });
  });

  describe('MoneyEntry', () => {
    it('should render InputPrimitive with correct props', () => {
      const viewModel = {
        ...baseViewModel,
        value: '100',
        onCurrencyChange: mockOnChange,
        placeholder: '€ 0,00',
      } as any;

      render(<MoneyEntry viewModel={viewModel} />);

      expect(getMock('InputPrimitive')).toHaveBeenCalledTimes(1);
      expect(getProps('InputPrimitive')).toEqual(
        expect.objectContaining({
          value: '100',
          placeholder: '€ 0,00',
          keyboardType: 'decimal-pad',
        })
      );
    });

    it('should handle currency change', () => {
      const viewModel = {
        ...baseViewModel,
        value: '100',
        onCurrencyChange: mockOnChange,
        placeholder: '€ 0,00',
      } as any;

      const { getByTestId } = render(<MoneyEntry viewModel={viewModel} />);
      const textElement = getByTestId('input-primitive').findByType('Text');
      fireEvent.press(textElement);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('DateEntry', () => {
    it('should render DatePrimitive with correct props', () => {
      const viewModel = {
        ...baseViewModel,
        value: new Date('2024-01-01'),
        onDateChange: mockOnChange,
      } as any;

      render(<DateEntry viewModel={viewModel} />);

      expect(getMock('DatePrimitive')).toHaveBeenCalledTimes(1);
      expect(getProps('DatePrimitive')).toEqual(
        expect.objectContaining({
          value: expect.stringMatching(/2024|Jan|01/),
        })
      );
    });

    it('should handle date change', () => {
      const viewModel = {
        ...baseViewModel,
        value: new Date('2024-01-01'),
        onDateChange: mockOnChange,
      } as any;

      const { getByTestId } = render(<DateEntry viewModel={viewModel} />);
      const datePrimitive = getByTestId('date-primitive');
      const touchable = datePrimitive.findByType(TouchableOpacity);
      fireEvent.press(touchable);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('TextEntry', () => {
    it('should render InputPrimitive with text props', () => {
      const viewModel = {
        ...baseViewModel,
        value: 'test',
        onTextChange: mockOnChange,
        placeholder: 'Enter text',
      } as any;

      render(<TextEntry viewModel={viewModel} />);

      expect(getMock('InputPrimitive')).toHaveBeenCalledTimes(1);
      // keyboardType wordt niet doorgegeven door TextEntry — sleutel bestaat niet in props-object.
      // objectContaining({ keyboardType: undefined }) zou falen omdat de sleutel afwezig is.
      expect(getProps('InputPrimitive')).toEqual(
        expect.objectContaining({
          value: 'test',
          placeholder: 'Enter text',
        })
      );
      expect(getProps('InputPrimitive')).not.toHaveProperty('keyboardType');
    });
  });

  describe('NumberEntry', () => {
    it('should render InputPrimitive with numeric keyboard', () => {
      const viewModel = {
        ...baseViewModel,
        value: 123,
        onNumberChange: mockOnChange,
        placeholder: 'Enter number',
      } as any;

      render(<NumberEntry viewModel={viewModel} />);

      expect(getMock('InputPrimitive')).toHaveBeenCalledTimes(1);
      expect(getProps('InputPrimitive')).toEqual(
        expect.objectContaining({
          value: 123,
          placeholder: 'Enter number',
          keyboardType: 'numeric',
        })
      );
    });
  });

  describe('CounterEntry', () => {
    it('should render CounterPrimitive', () => {
      const viewModel = {
        ...baseViewModel,
        value: 5,
        onCounterChange: mockOnChange,
      } as any;

      render(<CounterEntry viewModel={viewModel} />);

      expect(getMock('CounterPrimitive')).toHaveBeenCalledTimes(1);
      expect(getProps('CounterPrimitive')).toEqual(
        expect.objectContaining({ value: 5 })
      );
    });

    it('should handle counter change', () => {
      const viewModel = {
        ...baseViewModel,
        value: 5,
        onCounterChange: mockOnChange,
      } as any;

      const { getByText } = render(<CounterEntry viewModel={viewModel} />);
      const plusButton = getByText('+').parent;
      fireEvent.press(plusButton);

      expect(mockOnChange).toHaveBeenCalledWith(6);
    });
  });

  describe('ToggleEntry', () => {
    it('should render TogglePrimitive', () => {
      const viewModel = {
        ...baseViewModel,
        value: true,
        onToggle: mockOnChange,
        labelTrue: 'Yes',
        labelFalse: 'No',
      } as any;

      render(<ToggleEntry viewModel={viewModel} />);

      expect(getMock('TogglePrimitive')).toHaveBeenCalledTimes(1);
      expect(getProps('TogglePrimitive')).toEqual(
        expect.objectContaining({ value: true })
      );
    });

    it('should handle toggle', () => {
      const viewModel = {
        ...baseViewModel,
        value: true,
        onToggle: mockOnChange,
        labelTrue: 'Yes',
        labelFalse: 'No',
      } as any;

      const { getByTestId } = render(<ToggleEntry viewModel={viewModel} />);
      const togglePrimitive = getByTestId('toggle-primitive');
      const switchComponent = togglePrimitive.findByType(Switch);
      fireEvent(switchComponent, 'onValueChange', false);

      expect(mockOnChange).toHaveBeenCalledWith(false);
    });
  });

  describe('ChipGroupEntry', () => {
    const mockChipPress = jest.fn();

    const viewModel = {
      ...baseViewModel,
      chipContainerStyle: { flexDirection: 'row' },
      chips: [
        {
          label: 'Chip 1',
          selected: true,
          onPress: mockChipPress,
          containerStyle: { margin: 5 },
          textStyle: { color: 'blue' },
          accessibilityLabel: 'chip-1',
        },
        {
          label: 'Chip 2',
          selected: false,
          onPress: mockChipPress,
          containerStyle: { margin: 5 },
          textStyle: { color: 'gray' },
          accessibilityLabel: 'chip-2',
        },
      ],
    } as any;

    it('should render all chips', () => {
      const { getByTestId } = render(<ChipGroupEntry viewModel={viewModel} />);
      expect(getByTestId('chip-Chip 1')).toBeTruthy();
      expect(getByTestId('chip-Chip 2')).toBeTruthy();
    });

    it('should handle chip press', () => {
      const { getByTestId } = render(<ChipGroupEntry viewModel={viewModel} />);
      fireEvent.press(getByTestId('chip-Chip 1'));
      expect(mockChipPress).toHaveBeenCalled();
    });
  });

  describe('RadioEntry', () => {
    const mockSelect = jest.fn();

    const viewModel = {
      ...baseViewModel,
      radioContainerStyle: { flexDirection: 'column' },
      options: [
        { label: 'Option 1', selected: true, onSelect: mockSelect },
        { label: 'Option 2', selected: false, onSelect: mockSelect },
      ],
    } as any;

    it('should render all radio options', () => {
      const { getByTestId } = render(<RadioEntry viewModel={viewModel} />);
      expect(getByTestId('radio-Option 1')).toBeTruthy();
      expect(getByTestId('radio-Option 2')).toBeTruthy();
    });

    it('should handle radio selection', () => {
      const { getByTestId } = render(<RadioEntry viewModel={viewModel} />);
      fireEvent.press(getByTestId('radio-Option 1'));
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe('ActionEntry', () => {
    it('should render ButtonPrimitive', () => {
      const viewModel = {
        ...baseViewModel,
        label: 'Click me',
        onPress: mockOnPress,
      } as any;

      render(<ActionEntry viewModel={viewModel} />);

      expect(getMock('ButtonPrimitive')).toHaveBeenCalledTimes(1);
      expect(getProps('ButtonPrimitive')).toEqual(
        expect.objectContaining({ label: 'Click me' })
      );
    });

    it('should handle button press', () => {
      const viewModel = {
        ...baseViewModel,
        label: 'Click me',
        onPress: mockOnPress,
      } as any;

      const { getByTestId } = render(<ActionEntry viewModel={viewModel} />);
      fireEvent.press(getByTestId('button-primitive'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('LabelEntry', () => {
    it('should render LabelPrimitive', () => {
      const viewModel = {
        ...baseViewModel,
        label: 'Total',
        value: '€ 100',
        labelStyle: { fontWeight: 'bold' },
        valueStyle: { color: 'green' },
      } as any;

      render(<LabelEntry viewModel={viewModel} />);

      expect(getMock('LabelPrimitive')).toHaveBeenCalledTimes(1);
      expect(getProps('LabelPrimitive')).toEqual(
        expect.objectContaining({
          label: 'Total',
          value: '€ 100',
        })
      );
    });
  });

  describe('memoization', () => {
    it('should memoize all components to prevent unnecessary re-renders', () => {
      const viewModel = {
        ...baseViewModel,
        value: '100',
        onCurrencyChange: mockOnChange,
        placeholder: '€ 0,00',
      } as any;

      getMock('InputPrimitive').mockClear();

      const { rerender } = render(<MoneyEntry viewModel={viewModel} />);
      expect(getMock('InputPrimitive')).toHaveBeenCalledTimes(1);

      // Zelfde viewModel-referentie → React.memo slaat re-render over → InputPrimitive blijft op 1 aanroep.
      // Dit bewijst dat memo correct werkt.
      rerender(<MoneyEntry viewModel={viewModel} />);
      expect(getMock('InputPrimitive')).toHaveBeenCalledTimes(1);
    });
  });
});
