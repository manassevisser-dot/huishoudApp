import * as React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import ChipButton from './ChipButton';
import ToggleSwitch from './ToggleSwitch';
import InputCounter from './InputCounter';

// FIX: Importeer FieldConfig en haal FieldOption uit de array definitie 
// of gebruik de juiste alias die je script heeft aangemaakt.
import { FieldConfig } from '@shared-types/form';

// Als FieldOption niet direct geëxporteerd wordt, definiëren we hem hier 
// zodat de component blijft werken zonder de globale types te breken.
export type FieldOption = {
  label: string;
  value: string | number;
};

export type FormFieldProps = {
  field: FieldConfig & { options?: FieldOption[] }; // Verrijkt met opties voor de radio-chips
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
  errorColor?: string | null;
  state?: any;
};

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  errorColor,
  state,
}) => {
  const { styles } = useAppStyles() as any;
  const displayLabel = field.labelDynamic ? value : field.label;

  const handleChange = (newValue: any) => {
    onChange(field.id, newValue);
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={[styles.input, error && styles.inputError]}
            onChangeText={handleChange}
            value={value}
            placeholder={field.placeholder ?? 'Voer tekst in'}
          />
        );

      case 'numeric':
        return (
          <View style={styles.numericWrapper}>
            <Text style={styles.currencyPrefix}>€</Text>
            <TextInput
              style={[styles.numericInput, error && styles.inputError]}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                handleChange(cleanText === '' ? 0 : parseInt(cleanText, 10));
              }}
              value={value != null ? String(value) : ''}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        );

      case 'radio-chips':
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {field.options?.map((opt: FieldOption) => (
              <ChipButton
                key={opt.value}
                label={opt.label}
                selected={value === opt.value}
                onPress={() => handleChange(opt.value)}
              />
            ))}
          </ScrollView>
        );

      case 'toggle':
        return (
          <ToggleSwitch
            value={!!value}
            onToggle={() => handleChange(!value)}
          />
        );

      case 'counter':
        return (
          <InputCounter
            value={Number(value) || 0}
            min={field.validation?.min ?? 0}
            max={field.validation?.max ?? 10}
            onValueChange={handleChange}
          />
        );

      default:
        return null; // Legacy repeaters zijn hier verwijderd
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, error && styles.fieldLabelError, errorColor ? { color: errorColor } : {}]}>
        {displayLabel}
      </Text>
      {renderInput()}
      {error && <Text style={[styles.errorTextStyle, errorColor ? { color: errorColor } : {}]}>{error}</Text>}
    </View>
  );
};

export default FormField;