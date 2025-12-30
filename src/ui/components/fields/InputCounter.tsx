
// src/ui/components/InputCounter.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/** Basissubset die beide varianten delen */
interface BaseProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  testIdBase?: string;
}

/** Phoenix-props: met fieldId + onChange(payload) */
interface PhoenixChangeProps extends BaseProps {
  fieldId: string;
  onChange: (payload: { fieldId: string; value: number }) => void;
  onUpdate?: never; // disambiguation
}

/** Legacy-props: alleen onUpdate(number) */
interface LegacyUpdateProps extends BaseProps {
  onUpdate: (val: number) => void;
  fieldId?: never;
  onChange?: never;
}

/** Eén publiek type dat beide toestaat */
export type InputCounterProps = PhoenixChangeProps | LegacyUpdateProps;

const InputCounter: React.FC<InputCounterProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  disabled,
  testIdBase = 'counter',
  ...rest
}) => {
  // Normaliseer callbacks:
  const isPhoenix = 'fieldId' in rest && typeof rest.fieldId === 'string';

  const emit = (next: number) => {
    if (isPhoenix) {
      rest.onChange?.({ fieldId: rest.fieldId, value: next });
    } else {
      rest.onUpdate?.(next);
    }
  };

  const dec = () => emit(Math.max(min, value - 1));
  const inc = () => emit(Math.min(max, value + 1));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
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

        <Text testID={`${testIdBase}-value`} accessibilityLabel={`Huidige waarde ${value}`} style={{ marginHorizontal: 15 }}>
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
