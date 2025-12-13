// src/components/FormField.tsx
import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';
import { onlyDigits, stripEmojiAndLimit } from '../utils/numbers';
import { parseDDMMYYYYtoISO, calculateAge, formatDate } from '../utils/date';

interface FormFieldProps {
  label: string;
  value?: string | number;
  type?: 'text' | 'number' | 'date';
  maxLength?: number;
  onChange: (val: string | number | undefined) => void;
  placeholder?: string;
  accessibilityLabel?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  type = 'text',
  maxLength,
  onChange,
  placeholder,
  accessibilityLabel,
}) => {
  const { styles } = useAppStyles();

  const [internalValue, setInternalValue] = React.useState<string>(
    type === 'date' && typeof value === 'string'
      ? formatDate(value, 'dd-mm-yyyy')
      : value?.toString() ?? ''
  );

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (type === 'date' && typeof value === 'string') {
      setInternalValue(formatDate(value, 'dd-mm-yyyy'));
    } else {
      setInternalValue(value?.toString() ?? '');
    }
  }, [value, type]);

  const handleChange = (text: string) => {
    setInternalValue(text);

    if (type === 'number') {
      const clean = onlyDigits(text).slice(0, maxLength);
      const num = clean.length ? Number(clean) : undefined;
      if (num !== undefined && !Number.isInteger(num)) {
        setError('Alleen gehele getallen toegestaan.');
      } else {
        setError(null);
      }
      onChange(num);
    } else if (type === 'date') {
      const iso = parseDDMMYYYYtoISO(text);
      if (iso) {
        const age = calculateAge(iso);
        if (age !== undefined) {
          if (age < 0) setError('Datum in de toekomst niet toegestaan.');
          else setError(null);
        }
        onChange(iso);
      } else {
        setError('Ongeldige datum. Gebruik DD-MM-YYYY');
        onChange(undefined);
      }
    } else {
      onChange(stripEmojiAndLimit(text, maxLength ?? 255));
      setError(null);
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={error ? [styles.input, styles.inputError] : styles.input}
        value={internalValue}
        placeholder={placeholder}
        keyboardType={type === 'number' ? 'number-pad' : 'default'}
        maxLength={maxLength}
        onChangeText={handleChange}
        accessibilityLabel={accessibilityLabel ?? label}
      />
      {error && <Text style={styles.errorTextStyle}>{error}</Text>}
    </View>
  );
};

export default FormField;
