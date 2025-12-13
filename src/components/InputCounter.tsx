// src/components/InputCounter.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';

type Props = {
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
  accessibilityLabel?: string;
};

const InputCounter: React.FC<Props> = ({
  value,
  min = 0,
  max,
  onValueChange,
  accessibilityLabel,
}) => {
  const { styles, colors } = useAppStyles();
  
  // Ensure value is always a valid number
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : min;

  const handleDecrement = () => {
    const newValue = safeValue - 1;
    if (newValue >= min) {
      onValueChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = safeValue + 1;
    if (max === undefined || newValue <= max) {
      onValueChange(newValue);
    }
  };

  const canDecrement = safeValue > min;
  const canIncrement = max === undefined || safeValue < max;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={handleDecrement}
        disabled={!canDecrement}
        style={{
          backgroundColor: canDecrement ? colors.primary : colors.secondary,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
          opacity: canDecrement ? 1 : 0.5,
        }}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel || 'Waarde'} verlagen`}
      >
        <Text style={{ color: canDecrement ? colors.primaryText : colors.textSecondary, fontSize: 20, fontWeight: 'bold' }}>
          −
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          marginHorizontal: 20,
          fontSize: 24,
          fontWeight: 'bold',
          minWidth: 40,
          textAlign: 'center',
          color: colors.textPrimary,
        }}
        accessibilityLabel={accessibilityLabel}
      >
        {safeValue}
      </Text>

      <TouchableOpacity
        onPress={handleIncrement}
        disabled={!canIncrement}
        style={{
          backgroundColor: canIncrement ? colors.primary : colors.secondary,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
          opacity: canIncrement ? 1 : 0.5,
        }}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel || 'Waarde'} verhogen`}
      >
        <Text style={{ color: canIncrement ? colors.primaryText : colors.textSecondary, fontSize: 20, fontWeight: 'bold' }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputCounter;