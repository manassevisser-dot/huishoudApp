import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';
import ChipButton from './ChipButton';
import ToggleSwitch from './ToggleSwitch';
import InputCounter from './InputCounter';
import HouseholdMemberRepeater from '../organisms/HouseholdMemberRepeater';
import IncomeRepeater from '../organisms/IncomeRepeater';
import ExpenseRepeater from '../organisms/ExpenseRepeater';
import { FieldConfig } from '../types/form';
import { validateField } from '../utils/validation';

export type FormFieldProps = {
  pageId: string;
  field: FieldConfig;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
  errorColor?: string | null;
  state?: any;
};

const FormField: React.FC<FormFieldProps> = ({
  pageId,
  field,
  value,
  onChange,
  error,
  errorColor,
  state,
}) => {
  const { styles, colors } = useAppStyles();
  const displayLabel = field.labelDynamic ? value : field.label;

  const handleChange = (newValue: any) => {
    onChange(field.id, newValue);
  };

  const renderInput = () => {
    // 1. Text
    if (field.type === 'text') {
      return (
        <TextInput
          style={[styles.input, error && styles.inputError]}
          onChangeText={handleChange}
          value={value}
          placeholder={field.placeholder ?? 'Voer tekst in'}
          accessibilityLabel={displayLabel}
        />
      );
    }

    // 2. Numeric
    if (field.type === 'numeric') {
      const numericValue = value != null ? String(value) : '';
      return (
        <View style={styles.numericWrapper}>
          <Text style={styles.currencyPrefix}>€</Text>
          <TextInput
            style={[styles.numericInput, error && styles.inputError]}
            onChangeText={(text) => {
              const cleanText = text.replace(/[^0-9.,]/g, '').replace(',', '.');
              const numberValue =
                parseFloat(cleanText) || (cleanText === '' ? '' : 0);
              handleChange(numberValue);
            }}
            value={numericValue}
            keyboardType="numeric"
            placeholder={field.placeholder ?? '0.00'}
            accessibilityLabel={displayLabel}
          />
        </View>
      );
    }

    // 3. Radio chips
    if (field.type === 'radio-chips' && field.options) {
      return (
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipContainer}
          showsHorizontalScrollIndicator={false}
        >
          {field.options.map((opt) => (
            <ChipButton
              key={opt.value}
              label={opt.label}
              selected={value === opt.value}
              error={!!error}
              onPress={() => handleChange(opt.value)}
              accessibilityLabel={`${displayLabel}: ${opt.label}`}
            />
          ))}
        </ScrollView>
      );
    }

    // 4. Toggle
    if (field.type === 'toggle') {
      const isTrue = value === true;
      return (
        <ToggleSwitch
          value={isTrue}
          onToggle={() => handleChange(!isTrue)}
          accessibilityLabel={displayLabel}
        />
      );
    }

    // 5. Counter
    if (field.type === 'counter') {
      const min = field.validation?.min ?? 0;
      const max = field.validation?.max;
      
      // Ensure value is always a valid number (never NaN or undefined)
      let numericValue: number;
      if (typeof value === 'number' && !isNaN(value)) {
        numericValue = value;
      } else if (typeof value === 'string' && value !== '') {
        const parsed = Number(value);
        numericValue = !isNaN(parsed) ? parsed : min;
      } else {
        numericValue = min;
      }

      const staticMax = field.validation?.max;
      const dynamicAdultsMax =
        field.id === 'aantalVolwassen'
          ? Math.min(Number(state?.C1?.aantalMensen ?? Infinity), 7)
          : undefined;
      const finalMax = field.id === 'aantalVolwassen' ? dynamicAdultsMax : staticMax;

      return (
        <InputCounter
          value={numericValue}
          min={min}
          max={finalMax}
          onValueChange={handleChange}
          accessibilityLabel={displayLabel}
        />
      );
    }

    // 6. Repeater-array (C4 members)
    if (field.type === 'repeater-array') return <HouseholdMemberRepeater />;

    // 7. Income repeater (C7)
    if (field.type === 'income-repeater') return <IncomeRepeater />;

    // 8. Expense repeater (C10)
    if (field.type === 'expense-repeater') return <ExpenseRepeater />;

    return (
      <Text style={styles.errorTextStyle}>Onbekend veldtype: {field.type}</Text>
    );
  };

  return (
    <View style={styles.fieldContainer}>
      <Text
        style={[
          styles.label,
          error && styles.labelError,
          errorColor ? { color: errorColor } : {},
        ]}
      >
        {displayLabel}
      </Text>
      {renderInput()}
      {error && (
        <Text
          style={[
            styles.errorTextStyle,
            errorColor ? { color: errorColor } : {},
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default FormField;