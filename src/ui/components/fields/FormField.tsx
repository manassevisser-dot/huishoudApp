// src/ui/components/fields/FormField.tsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

// ✅ Lokale façade-interfaces (UI praat met strings; geen domain-types hier)
interface ValueProvider { getValue(fieldId: string): unknown; }
interface StateWriter   { updateField(fieldId: string, value: unknown): void; }

interface FormFieldProps {
  fieldId: string;
  valueProvider: ValueProvider;
  stateWriter: StateWriter;
  label: string; // Flow B: label komt als prop (token → label doe je in UI)
}

export const FormField: React.FC<FormFieldProps> = ({
  fieldId, valueProvider, stateWriter, label,
}) => {
  const { styles } = useAppStyles();
  const value = valueProvider.getValue(fieldId);
  const handleChange = (newValue: string) => stateWriter.updateField(fieldId, newValue);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={String(value ?? '')}
        onChangeText={handleChange}
        accessibilityLabel={label}
      />
    </View>
  );
};

export default FormField;