import React from 'react';
import { View, Text, TextInput, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';


// De Style-truc: Voor het geval we stijlen als props gaan doorgeven
type AnyStyle = ViewStyle | TextStyle | ImageStyle;

// De Data-truc: un_known vervangen door unknown
interface ValueProvider { getValue(fieldId: string): unknown; }
interface StateWriter   { updateField(fieldId: string, value: unknown): void; }

interface FormFieldProps {
  fieldId: string;
  valueProvider: ValueProvider;
  stateWriter: StateWriter;
  label: string;
  containerStyle?: AnyStyle; // Gebruik van de style-truc
}

export const FormField: React.FC<FormFieldProps> = ({
  fieldId, valueProvider, stateWriter, label, containerStyle
}) => {
  const { styles } = useAppStyles();
  const value = valueProvider.getValue(fieldId);
  
  const handleChange = (newValue: string) => stateWriter.updateField(fieldId, newValue);

  return (
    <View style={[styles.fieldContainer, containerStyle]}>
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