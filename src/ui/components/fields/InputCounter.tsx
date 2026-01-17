import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/** Phoenix-only props */
export type InputCounterProps = {
  label?: string;
  fieldId: string;
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  testIdBase?: string;
  onChange: (payload: { fieldId: string; value: number }) => void;
};

const InputCounter: React.FC<InputCounterProps> = ({
  label,
  fieldId,
  value,
  min = 0,
  max = 100,
  disabled,
  testIdBase = 'counter',
  onChange,
}) => {
  const emit = (next: number) => onChange({ fieldId, value: next });
  const dec = () => emit(Math.max(min, value - 1));
  const inc = () => emit(Math.min(max, value + 1));

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
      }}
    >
      {label ? <Text>{label}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          testID={`${testIdBase}-decrement`}
          accessibilityRole="button"
          accessibilityLabel="Verlagen"
          onPress={dec}
          disabled={disabled || value <= min}
        >
          <Text style={{ fontSize: 25 }}> - </Text>
        </TouchableOpacity>

        <Text
          testID={`${testIdBase}-value`}
          accessibilityLabel={`Huidige waarde ${value}`}
          style={{ marginHorizontal: 15 }}
        >
          {value}
        </Text>

        <TouchableOpacity
          testID={`${testIdBase}-increment`}
          accessibilityRole="button"
          accessibilityLabel="Verhogen"
          onPress={inc}
          disabled={disabled || value >= max}
        >
          <Text style={{ fontSize: 25 }}> + </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputCounter;
