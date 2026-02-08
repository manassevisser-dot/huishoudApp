import * as React from 'react';
import { Platform, View, Text, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { isoDateOnlyToLocalNoon, toISOFromLocalNoon, todayLocalNoon, formatToDisplay } from '@domain/helpers/DateHydrator';

type Props = {
  label: string;
  valueISO?: string;
  onChangeISO: (iso: string | undefined) => void;
  minISO?: string;
  maxISO?: string;
  errorText?: string | null;
  accessibilityLabel?: string;
};

const DateField: React.FC<Props> = ({
  label,
  valueISO,
  onChangeISO,
  minISO,
  maxISO,
  errorText,
  accessibilityLabel,
}) => {
  const { styles, colors } = useAppStyles();
  const [show, setShow] = React.useState(false);

  // FIX: Expliciete checks voor de linter
  const hasValue = typeof valueISO === 'string' && valueISO !== '';
  const dateValue = hasValue ? isoDateOnlyToLocalNoon(valueISO) : null;
  const display = dateValue !== null ? formatToDisplay(dateValue) : 'DD-MM-YYYY';
  const hasError = typeof errorText === 'string' && errorText !== '';
  
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (event.type === 'dismissed' || date === undefined || date === null) return;
    
    onChangeISO(toISOFromLocalNoon(date));
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        onPress={() => setShow(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        style={[
          styles.input, 
          { justifyContent: 'center' }, 
          hasError ? styles.inputError : null
        ]}
      >
        <Text style={{ color: hasValue ? colors.textPrimary : colors.textSecondary }}>
          {display}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          mode="date"
          value={dateValue !== null ? dateValue : (typeof maxISO === 'string' ? isoDateOnlyToLocalNoon(maxISO) ?? todayLocalNoon() : todayLocalNoon())}
          minimumDate={typeof minISO === 'string' ? isoDateOnlyToLocalNoon(minISO) ?? undefined : undefined}
          maximumDate={typeof maxISO === 'string' ? isoDateOnlyToLocalNoon(maxISO) ?? undefined : undefined}
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleDateChange}
        />
      )}
      {hasError ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
};

export default DateField;