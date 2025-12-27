import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

interface InputCounterProps {
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void; // Zorg dat dit onValueChange is
  label?: string;
  accessibilityLabel?: string;
}

const InputCounter: React.FC<InputCounterProps> = ({
  value,
  min = 0,
  max = 10,
  onValueChange,
  accessibilityLabel,
}) => {
  const { colors } = useAppStyles();

  const canDec = value > min;
  const canInc = value < max;

  const inc = () => canInc && onValueChange(value + 1);
  const dec = () => canDec && onValueChange(value - 1);

  // Gebruik een safeValue voor display om NaN te voorkomen
  const safeValue = isNaN(value) ? min : value;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={dec}
        disabled={!canDec}
        style={[
          styles.btn,
          { backgroundColor: canDec ? colors.primary : colors.secondary },
          !canDec && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel ?? 'Waarde'} verlagen`}
      >
        <Text style={[styles.sign, { color: canDec ? colors.textPrimary : colors.textSecondary }]}>
          -
        </Text>
      </TouchableOpacity>

      <Text style={[styles.value, { color: colors.textPrimary }]}>{safeValue}</Text>

      <TouchableOpacity
        onPress={inc}
        disabled={!canInc}
        style={[
          styles.btn,
          { backgroundColor: canInc ? colors.primary : colors.secondary },
          !canInc && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel ?? 'Waarde'} verhogen`}
      >
        <Text style={[styles.sign, { color: canInc ? colors.textPrimary : colors.textSecondary }]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  sign: { fontSize: 24, fontWeight: 'bold' },
  value: {
    marginHorizontal: 20,
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  disabled: { opacity: 0.5 },
});

export default InputCounter;
