import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/AppStyles';

export type InputCounterProps = {
  value: number;
  onValueChange: (next: number) => void;
  min?: number;
  max?: number; // <-- nieuw: optionele bovengrens
  accessibilityLabel?: string;
};

const InputCounter: React.FC<InputCounterProps> = ({
  value,
  onValueChange,
  min = 0,
  max,
  accessibilityLabel,
}) => {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
  const canDecrement = numericValue > min;
  const canIncrement = max === undefined || numericValue < max;

  const handleDecrement = () => {
    if (!canDecrement) return;
    const next = Math.max(min, numericValue - 1);
    onValueChange(next);
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    const next =
      max !== undefined ? Math.min(max, numericValue + 1) : numericValue + 1;
    onValueChange(next);
  };

  return (
    <View style={styles.chipContainer}>
      <TouchableOpacity
        style={[styles.chip, !canDecrement && { opacity: 0.5 }]}
        onPress={handleDecrement}
        disabled={!canDecrement}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ? `Verlaag ${accessibilityLabel}` : 'Verlaag'
        }>
        <Text style={styles.chipText}>-</Text>
      </TouchableOpacity>

      <Text
        style={[styles.label, { marginHorizontal: 12 }]}
        accessibilityLabel={accessibilityLabel}>
        {numericValue}
      </Text>

      <TouchableOpacity
        style={[styles.chip, !canIncrement && { opacity: 0.5 }]}
        onPress={handleIncrement}
        disabled={!canIncrement}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ? `Verhoog ${accessibilityLabel}` : 'Verhoog'
        }>
        <Text style={styles.chipText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputCounter;
