import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { toCents, formatCentsToDutch, formatDutchValue } from '@app/orchestrators/types';

type MoneyInputProps = {
  value: number; // Bedrag in centen (altijd >= 0)
  onValueChange: (cents: number) => void;
  disabled?: boolean;
  placeholder?: string;
  accessibilityLabel?: string;
};

const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = '',
  accessibilityLabel = 'Bedrag',
}) => {
  const { styles } = useAppStyles();

  // De lokale staat houdt de string vast die de gebruiker ziet
  const [localValue, setLocalValue] = React.useState<string>(formatCentsToDutch(value));

  // Sync lokale staat als de externe waarde (centen) wijzigt
  React.useEffect(() => {
    setLocalValue(formatCentsToDutch(value));
  }, [value]);

  // Bij focus: verwijder duizendtal-punten voor makkelijk bewerken
  const onFocus = () => setLocalValue(formatDutchValue(localValue));

  // Tijdens typen: saniteer direct (geen letters, geen minus)
  const onChangeText = (text: string) => setLocalValue(formatDutchValue(text));

  // Bij blur: bereken centen en formatteer naar NL-standaard
  const onBlur = () => {
    const cents = toCents(localValue);
    onValueChange(cents); // Emit positieve centen naar de state
    setLocalValue(formatCentsToDutch(cents)); // "On-blur formatting"
  };

  return (
    <View style={styles.inputMoneyRow}>
      {/* Vast, niet-bewerkbaar prefix  */}
      <Text style={styles.moneyPrefix} accessibilityLabel="Euro-teken">
        €
      </Text>

      <TextInput
        value={localValue}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        editable={!disabled}
        accessibilityLabel={accessibilityLabel}
        keyboardType="decimal-pad" // Forceert numeriek pad op mobile
        style={styles.moneyTextInput}
      />
    </View>
  );
};

export default MoneyInput;
