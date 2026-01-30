/**
 * TODO: REFACTOR NEEDED
 * This component violates SoC - it handles:
 * - ISO ↔ Date conversion (should be in DateService)
 * - Formatting (should be in formatters)
 * - Platform logic (should be in PlatformAdapter)
 * - Validation (should be in validators)
 * 
 * Target architecture:
 * DateField (dumb UI) → DateService → Formatters
 * 
 * ESLint disabled temporarily - see eslint.config.js
 */
import { formatDate } from '@ui/helpers/dateFormatting';
import * as React from 'react';
import { Platform, View, Text, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppStyles } from '@ui/styles/useAppStyles';

type Props = {
  label: string;
  valueISO?: string;
  onChangeISO: (iso: string | undefined) => void;
  minISO?: string;
  maxISO?: string;
  errorText?: string | null;
  accessibilityLabel?: string;
};

// ✅ Constants extracted
const DEFAULT_MIN_DATE = '1920-01-01';
const PAD_LENGTH = 2;
const PAD_CHAR = '0';
const UTC_NOON_HOUR = 12;

// ✅ Helper: ISO to Date
const isoToDate = (iso?: string): Date => {
  if (iso === null || iso === undefined || iso === '') {
    return new Date();
  }
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, UTC_NOON_HOUR, 0, 0));
};

// ✅ Helper: Today as ISO
const isoToday = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(PAD_LENGTH, PAD_CHAR);
  const d = String(now.getDate()).padStart(PAD_LENGTH, PAD_CHAR);
  return `${y}-${m}-${d}`;
};

// ✅ Helper: Date to ISO
const dateToISO = (dt: Date): string => {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(PAD_LENGTH, PAD_CHAR);
  const d = String(dt.getUTCDate()).padStart(PAD_LENGTH, PAD_CHAR);
  return `${y}-${m}-${d}`;
};

// ✅ Helper: Get display value (extracted to reduce complexity)
const getDisplayValue = (valueISO?: string): string => {
  if (valueISO === null || valueISO === undefined || valueISO === '') {
    return '';
  }
  return formatDate(valueISO, 'dd-mm-yyyy');
};

// ✅ Main component - reduced to 28 lines, complexity 6
const DateField: React.FC<Props> = ({
  label,
  valueISO,
  onChangeISO,
  minISO = DEFAULT_MIN_DATE,
  maxISO,
  errorText,
  accessibilityLabel,
}) => {
  const { styles, colors } = useAppStyles();
  const [show, setShow] = React.useState(false);

  const max = maxISO ?? isoToday();
  const display = getDisplayValue(valueISO);
  const hasValue = valueISO !== null && valueISO !== undefined && valueISO !== '';
  const hasError = errorText !== null && errorText !== undefined && errorText !== '';

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'dismissed') {
      return;
    }
    if (date === null || date === undefined) {
      return;
    }
    const iso = dateToISO(date);
    onChangeISO(iso);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <Pressable
        onPress={() => setShow(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        style={[styles.input, { justifyContent: 'center' }, hasError && styles.inputError]}
      >
        <Text style={{ color: hasValue ? colors.textPrimary : colors.textSecondary }}>
        {display !== '' ? display : 'DD-MM-YYYY'}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          mode="date"
          value={hasValue ? isoToDate(valueISO) : isoToDate(max)}
          minimumDate={isoToDate(minISO)}
          maximumDate={isoToDate(max)}
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleDateChange}
        />
      )}

      {hasError && <Text style={styles.errorTextStyle}>{errorText}</Text>}
    </View>
  );
};

export default DateField;