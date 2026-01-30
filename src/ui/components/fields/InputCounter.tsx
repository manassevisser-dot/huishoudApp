// src/ui/components/fields/InputCounter.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

/**
 * UI-façade interfaces:
 * Geen domain-imports.
 * Geen StateWriter.updateField(...).
 */
interface UIValueProvider {
  getValue(fieldId: string): unknown;
}

interface UIStateWriter {
  (value: number): void;
}

export interface InputCounterProps {
  fieldId: string;
  valueProvider?: UIValueProvider;
  stateWriter?: UIStateWriter;
  value?: number;
  testIdBase?: string;
}

/**
 * InputCounter: Dumb UI component
 * ADR-01 Compliant: No domain imports, uses façade pattern
 * Uses existing styles from Helpers.ts module
 */
export const InputCounter: React.FC<InputCounterProps> = ({
  fieldId,
  valueProvider,
  stateWriter,
  value: propValue,
  testIdBase = 'counter',
}) => {
  const { styles } = useAppStyles();

  // Determine display value
  const displayValue = getDisplayValue(propValue, valueProvider, fieldId);

  // Emit handler
  const handleChange = (delta: number) => {
    if (stateWriter !== null && stateWriter !== undefined) {
      stateWriter(displayValue + delta);
    }
  };

  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity
        onPress={() => handleChange(-1)}
        testID={`${testIdBase}-decrement`}
      >
        <Text style={styles.counterButton}>-</Text>
      </TouchableOpacity>

      <Text style={styles.counterValue} testID={`${testIdBase}-value`}>
        {displayValue}
      </Text>

      <TouchableOpacity
        onPress={() => handleChange(1)}
        testID={`${testIdBase}-increment`}
      >
        <Text style={styles.counterButton}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Helper: Get display value from prop or provider
 */
function getDisplayValue(
  propValue: number | undefined,
  valueProvider: UIValueProvider | undefined,
  fieldId: string
): number {
  if (propValue !== undefined) {
    return propValue;
  }
  
  if (valueProvider !== null && valueProvider !== undefined) {
    const value = valueProvider.getValue(fieldId);
    return typeof value === 'number' ? value : 0;
  }
  
  return 0;
}

export default InputCounter;