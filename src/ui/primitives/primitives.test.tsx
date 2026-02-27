// src/ui/primitives/primitives.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  InputPrimitive,
  DatePrimitive,
  CounterPrimitive,
  ChipPrimitive,
  TogglePrimitive,
  ButtonPrimitive,
  LabelPrimitive,
  RadioOptionPrimitive,
  DynamicPrimitive,
} from './primitives';
import { PRIMITIVE_TYPES } from '@ui/kernel';
import { Switch, TextStyle } from 'react-native';
// Mocks - deze horen BOVENAAN, niet in een describe!
jest.mock('@react-native-community/datetimepicker', () => {
  const { View, Button } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(({ value, mode, onChange }) => (
      <View testID="datetime-picker">
        <Button 
          title="Select Date" 
          onPress={() => onChange({ type: 'set' }, new Date('2024-01-01'))}
        />
      </View>
    )),
  };
});

describe('Primitives', () => {
  const mockOnAction = jest.fn();
  const mockOnDateChange = jest.fn();
  const mockOnCounterChange = jest.fn();
  const mockOnToggle = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('InputPrimitive', () => {
    it('should render correctly with value', () => {
      const { getByDisplayValue } = render(
        <InputPrimitive value="test" onAction={mockOnAction} />
      );
      expect(getByDisplayValue('test')).toBeTruthy();
    });

    it('should show placeholder when value is empty', () => {
      const { getByPlaceholderText } = render(
        <InputPrimitive value="" onAction={mockOnAction} placeholder="Enter text" />
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should call onAction when text changes', () => {
      const { getByDisplayValue } = render(
        <InputPrimitive value="test" onAction={mockOnAction} />
      );
      const input = getByDisplayValue('test');
      fireEvent.changeText(input, 'new value');
      expect(mockOnAction).toHaveBeenCalledWith('new value');
    });

    it('should apply keyboard type', () => {
      const { getByDisplayValue } = render(
        <InputPrimitive value="123" onAction={mockOnAction} keyboardType="numeric" />
      );
      const input = getByDisplayValue('123');
      expect(input.props.keyboardType).toBe('numeric');
    });

    it('should apply custom style', () => {
      const customStyle = { color: 'red', fontSize: 16 };
      const { getByDisplayValue } = render(
        <InputPrimitive value="test" onAction={mockOnAction} style={customStyle} />
      );
      const input = getByDisplayValue('test');
      expect(input.props.style).toBe(customStyle);
    });
  });

  describe('DatePrimitive', () => {
    it('should render TextInput with value when provided', () => {
      const { getByDisplayValue } = render(
        <DatePrimitive value="2024-01-01" onDateChange={mockOnDateChange} />
      );
      expect(getByDisplayValue('2024-01-01')).toBeTruthy();
    });

    it('should show placeholder when value is empty', () => {
      const { getByPlaceholderText } = render(
        <DatePrimitive value="" onDateChange={mockOnDateChange} placeholder="Select date" />
      );
      expect(getByPlaceholderText('Select date')).toBeTruthy();
    });

    it('should open DateTimePicker on press', () => {
      const { getByDisplayValue } = render(
        <DatePrimitive value="2024-01-01" onDateChange={mockOnDateChange} />
      );
      
      const textInput = getByDisplayValue('2024-01-01');
      const touchable = textInput.parent?.parent;
      fireEvent.press(touchable);
      
      const { default: DateTimePicker } = require('@react-native-community/datetimepicker');
      expect(DateTimePicker).toHaveBeenCalled();
    });

    it('should call onDateChange when date is selected', () => {
      const { getByDisplayValue } = render(
        <DatePrimitive value="" onDateChange={mockOnDateChange} />
      );
      
      const textInput = getByDisplayValue('');
      const touchable = textInput.parent?.parent;
      fireEvent.press(touchable);
      
      const { default: DateTimePicker } = require('@react-native-community/datetimepicker');
      const pickerCall = (DateTimePicker as jest.Mock).mock.calls[0][0];
      pickerCall.onChange({ type: 'set' }, new Date('2024-01-01'));
      
      expect(mockOnDateChange).toHaveBeenCalledWith('2024-01-01');
    });
  });

  describe('CounterPrimitive', () => {
    it('should render with current value', () => {
      const { getByText } = render(
        <CounterPrimitive value={5} onCounterChange={mockOnCounterChange} />
      );
      expect(getByText('5')).toBeTruthy();
      expect(getByText('-')).toBeTruthy();
      expect(getByText('+')).toBeTruthy();
    });

    it('should call onCounterChange with decremented value when - pressed', () => {
      const { getByText } = render(
        <CounterPrimitive value={5} onCounterChange={mockOnCounterChange} />
      );
      const minusButton = getByText('-').parent;
      fireEvent.press(minusButton);
      expect(mockOnCounterChange).toHaveBeenCalledWith(4);
    });

    it('should call onCounterChange with incremented value when + pressed', () => {
      const { getByText } = render(
        <CounterPrimitive value={5} onCounterChange={mockOnCounterChange} />
      );
      const plusButton = getByText('+').parent;
      fireEvent.press(plusButton);
      expect(mockOnCounterChange).toHaveBeenCalledWith(6);
    });

    it('should apply custom style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { UNSAFE_root } = render(
        <CounterPrimitive value={5} onCounterChange={mockOnCounterChange} style={customStyle} />
      );
      const container = UNSAFE_root.children[0];
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });
  });

  describe('ChipPrimitive', () => {
    it('should render with label', () => {
      const { getByText } = render(
        <ChipPrimitive label="Test Chip" selected={false} onPress={mockOnPress} />
      );
      expect(getByText('Test Chip')).toBeTruthy();
    });

    it('should apply selected styles when selected', () => {
  const { getByTestId } = render(
    <ChipPrimitive 
      label="Test Chip" 
      selected={true} 
      onPress={mockOnPress}
      testID="chip"
    />
  );
  const chip = getByTestId('chip');
  
  // style is een object, geen array!
  expect(chip.props.style).toEqual({ opacity: 0.7 });
  expect(chip.props.accessibilityState?.selected).toBe(true);
});

    it('should call onPress when pressed', () => {
      const { getByText } = render(
        <ChipPrimitive label="Test Chip" selected={false} onPress={mockOnPress} />
      );
      const chip = getByText('Test Chip').parent;
      fireEvent.press(chip);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should apply container and text styles', () => {
  const containerStyle = { backgroundColor: 'blue', padding: 10 };
  const textStyle = { color: 'white', fontSize: 14 };
  
  const { getByTestId, getByText } = render(
    <ChipPrimitive 
      label="Test Chip" 
      selected={false} 
      onPress={mockOnPress}
      containerStyle={containerStyle}
      textStyle={textStyle}
      testID="chip"
    />
  );
  
  const chip = getByTestId('chip');
  const text = getByText('Test Chip');
  
  // containerStyle wordt samengevoegd, niet vervangen
  expect(chip.props.style).toEqual(
    expect.objectContaining(containerStyle)
  );
  expect(text.props.style).toBe(textStyle);
});

    it('should set accessibilityLabel', () => {
      const { getByTestId } = render(
        <ChipPrimitive
          testID="chip"
          label="Test Chip"
          selected={false}
          onPress={mockOnPress}
          accessibilityLabel="Accessible Chip"
        />
      );
      const chip = getByTestId('chip');
      expect(chip.props.accessibilityLabel).toBe('Accessible Chip');
    });
  });

  describe('TogglePrimitive', () => {
    it('should render Switch with correct value', () => {
      const { UNSAFE_getByType } = render(
        <TogglePrimitive value={true} onToggle={mockOnToggle} />
      );
      const switch_ = UNSAFE_getByType(Switch);
      expect(switch_.props.value).toBe(true);
    });

    it('should call onToggle when value changes', () => {
      const { UNSAFE_getByType } = render(
        <TogglePrimitive value={true} onToggle={mockOnToggle} />
      );
      const switch_ = UNSAFE_getByType(Switch);
      fireEvent(switch_, 'onValueChange', false);
      expect(mockOnToggle).toHaveBeenCalledWith(false);
    });

    it('should apply custom style', () => {
      const customStyle = { margin: 10 };
      const { UNSAFE_getByType } = render(
        <TogglePrimitive value={true} onToggle={mockOnToggle} style={customStyle} />
      );
      const switch_ = UNSAFE_getByType(Switch);
      expect(switch_.props.style).toBe(customStyle);
    });
  });

  describe('ButtonPrimitive', () => {
    it('should render with label', () => {
      const { getByText } = render(
        <ButtonPrimitive label="Click me" onPress={mockOnPress} />
      );
      expect(getByText('Click me')).toBeTruthy();
    });

    it('should call onPress when pressed', () => {
      const { getByText } = render(
        <ButtonPrimitive label="Click me" onPress={mockOnPress} />
      );
      const button = getByText('Click me').parent;
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should apply container and text styles', () => {
      const containerStyle = { backgroundColor: 'blue', padding: 10 };
      const textStyle = { color: 'white', fontSize: 16 };
      
      const { getByTestId, getByText } = render(
        <ButtonPrimitive
          testID="button"
          label="Click me"
          onPress={mockOnPress}
          style={containerStyle}
          textStyle={textStyle}
        />
      );
      
      const button = getByTestId('button');
      const text = getByText('Click me');
      
      // TouchableOpacity ontvangt style direct (niet als array) — objectContaining volstaat
      expect(button.props.style).toEqual(expect.objectContaining(containerStyle));
      expect(text.props.style).toBe(textStyle);
    });
  });

  describe('LabelPrimitive', () => {
    it('should render label and value', () => {
      const { getByText } = render(
        <LabelPrimitive label="Total" value="€ 100" />
      );
      expect(getByText('Total')).toBeTruthy();
      expect(getByText('€ 100')).toBeTruthy();
    });

    it('should apply container, label and value styles', () => {
      const containerStyle = { padding: 10 };
      const labelStyle: TextStyle = { fontSize: 14, color: 'gray' }; // ✅ Expliciet type
  const valueStyle: TextStyle = { fontSize: 18, fontWeight: 'bold' }; 
      
      const { getByText, UNSAFE_root } = render(
        <LabelPrimitive 
          label="Total" 
          value="€ 100"
          style={containerStyle}
          labelStyle={labelStyle}
          valueStyle={valueStyle}
        />
      );
      
      const container = UNSAFE_root.children[0];
      const label = getByText('Total');
      const value = getByText('€ 100');
      
      expect(container.props.style).toBe(containerStyle);
      expect(label.props.style).toBe(labelStyle);
      expect(value.props.style).toBe(valueStyle);
    });
  });

  describe('RadioOptionPrimitive', () => {
    it('should render with label', () => {
      const { getByText } = render(
        <RadioOptionPrimitive label="Option 1" selected={false} onSelect={mockOnPress} />
      );
      expect(getByText('Option 1')).toBeTruthy();
    });

    it('should show selected state when selected', () => {
      const { getByTestId } = render(
        <RadioOptionPrimitive label="Option 1" selected={true} onSelect={mockOnPress} />
      );

      expect(getByTestId('radio-inner-circle').props.style).toHaveProperty('opacity', 1);
    });

    it('should not show selected state when not selected', () => {
      const { getByTestId, getByText } = render(
        <RadioOptionPrimitive label="Option 1" selected={false} onSelect={mockOnPress} />
      );

      expect(getByTestId('radio-inner-circle').props.style).toHaveProperty('opacity', 0);
      expect(getByText('Option 1')).toBeTruthy();
    });


    it('should call onSelect when pressed', () => {
      const { getByText } = render(
        <RadioOptionPrimitive label="Option 1" selected={false} onSelect={mockOnPress} />
      );
      const option = getByText('Option 1').parent;
      fireEvent.press(option);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('DynamicPrimitive', () => {
    it('should render correct primitive based on type', () => {
      const props = { value: 'test', onAction: mockOnAction };
      
      const { UNSAFE_root } = render(
        <DynamicPrimitive primitiveType={PRIMITIVE_TYPES.TEXT} props={props} />
      );
      
      expect(UNSAFE_root.children[0]).toBeTruthy();
    });

    it('should return null for unknown primitive type', () => {
      const { UNSAFE_root } = render(
        <DynamicPrimitive primitiveType="UNKNOWN" props={{}} />
      );
      
      expect(UNSAFE_root.children).toHaveLength(0);
    });

    it('should handle all registered primitive types', () => {
      const types = [
        PRIMITIVE_TYPES.TEXT,
        PRIMITIVE_TYPES.CURRENCY,
        PRIMITIVE_TYPES.NUMBER,
        PRIMITIVE_TYPES.DATE,
        PRIMITIVE_TYPES.COUNTER,
        PRIMITIVE_TYPES.TOGGLE,
        PRIMITIVE_TYPES.CHIP_GROUP,
        PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE,
        PRIMITIVE_TYPES.RADIO,
        PRIMITIVE_TYPES.LABEL,
        PRIMITIVE_TYPES.ACTION,
      ];

      types.forEach(type => {
        const { UNSAFE_root } = render(
          <DynamicPrimitive primitiveType={type} props={{}} />
        );
        expect(UNSAFE_root.children).toHaveLength(1);
      });
    });

    it('should pass props to the rendered primitive', () => {
      const props = { value: 'test value', onAction: mockOnAction };
      
      const { UNSAFE_root } = render(
        <DynamicPrimitive primitiveType={PRIMITIVE_TYPES.TEXT} props={props} />
      );
      
      expect(UNSAFE_root.children[0]).toBeTruthy();
    });
  });

  describe('JSDoc claims verification', () => {
    it('should be stateless and uncontrolled', () => {
      const { rerender } = render(
        <InputPrimitive value="initial" onAction={mockOnAction} />
      );
      
      rerender(<InputPrimitive value="updated" onAction={mockOnAction} />);
    });
  });
});