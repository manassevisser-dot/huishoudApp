// src/ui/primitives/primitives.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleProp, ViewStyle, TextStyle } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
/**
 * PROPS DEFINITIES
 */
interface InputPrimitiveProps {
  value: string;
  onAction: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address' | 'phone-pad';
  style?: StyleProp<TextStyle>;
}
interface DatePrimitiveProps {
    value?: string;
    onDateChange: (date: string) => void;
    placeholder?: string;
    style?: StyleProp<TextStyle>;
  }
interface CounterPrimitiveProps {
  value: number;
  onCounterChange: (newValue: number) => void;
  style?: StyleProp<ViewStyle>;
}

interface TogglePrimitiveProps {
  value: boolean;
  onToggle: (newValue: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

interface ButtonPrimitiveProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

interface LabelPrimitiveProps {
  label: string;
  value: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

interface ChipPrimitiveProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    accessibilityLabel?: string;
  }
  
  interface RadioOptionProps {
    label: string;
    selected: boolean;
    onSelect: () => void;
  }
    
  export const RadioOptionPrimitive = ({ label, selected, onSelect }: RadioOptionProps) => (
    <TouchableOpacity onPress={onSelect} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
      <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
        {selected && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#000' }} />}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
/**
 * PRIMITIVES
 */
export const InputPrimitive = ({ value, onAction, placeholder, keyboardType, style }: InputPrimitiveProps) => (
  <TextInput
    value={value}
    onChangeText={onAction}
    placeholder={placeholder}
    keyboardType={keyboardType}
    style={style}
  />
);
export const DatePrimitive = ({ value, onDateChange, placeholder, style }: DatePrimitiveProps) => {
    const [show, setShow] = React.useState(false);
    const hasValue = typeof value === 'string' && value.length > 0;
  
    const onChange = (_: DateTimePickerEvent, date?: Date) => {
      setShow(false);
      if (date !== undefined) onDateChange(date.toISOString().split('T')[0]);
    };
  
    return (
      <>
        <TouchableOpacity onPress={() => setShow(true)}>
          <View pointerEvents="none">
            <TextInput
              value={hasValue ? value : ''}
              placeholder={placeholder}
              style={style}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={hasValue ? new Date(value as string) : new Date()}
            mode="date"
            onChange={onChange}
          />
        )}
      </>
    );
  };
export const CounterPrimitive = ({ value, onCounterChange, style }: CounterPrimitiveProps) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    <TouchableOpacity onPress={() => onCounterChange(value - 1)}><Text>-</Text></TouchableOpacity>
    <Text style={{ marginHorizontal: 15 }}>{value}</Text>
    <TouchableOpacity onPress={() => onCounterChange(value + 1)}><Text>+</Text></TouchableOpacity>
  </View>
);

export const ChipPrimitive = ({ label, selected, onPress, containerStyle, textStyle, accessibilityLabel }: ChipPrimitiveProps) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[containerStyle, selected && { opacity: 0.7 }]}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
export const TogglePrimitive = ({ value, onToggle, style }: TogglePrimitiveProps) => (
  <Switch value={value} onValueChange={onToggle} style={style} />
);

export const ButtonPrimitive = ({ label, onPress, style, textStyle }: ButtonPrimitiveProps) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={textStyle}>{label}</Text>
  </TouchableOpacity>
);

export const LabelPrimitive = ({ label, value, style, labelStyle, valueStyle }: LabelPrimitiveProps) => (
  <View style={style}>
    <Text style={labelStyle}>{label}</Text>
    <Text style={valueStyle}>{value}</Text>
  </View>
);