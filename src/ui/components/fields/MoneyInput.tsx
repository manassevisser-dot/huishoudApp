import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

type MoneyInputProps = {
  displayValue: string; // De geformatteerde string vanuit de state/orchestrator
  onValueChange: (value: string) => void; // Stuur de rauwe string terug naar de orchestrator
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  accessibilityLabel?: string;
};

const MoneyInput: React.FC<MoneyInputProps> = ({
  displayValue,
  onValueChange,
  onBlur,
  disabled = false,
  placeholder = '',
  accessibilityLabel = 'Bedrag',
}) => {
  // We halen de stijlen op uit de centrale hook
  const { styles } = useAppStyles();

  return (
    <View style={styles.inputMoneyRow}>
      {/* Het euro-teken krijgt de moneyPrefix stijl */}
      <Text style={styles.moneyPrefix} accessibilityLabel="Euro-teken">
        €
      </Text>

      {/* Het invulveld krijgt de moneyTextInput stijl */}
      <TextInput
        value={displayValue}
        onChangeText={onValueChange}
        onBlur={onBlur}
        placeholder={placeholder}
        editable={!disabled}
        accessibilityLabel={accessibilityLabel}
        keyboardType="decimal-pad"
        style={styles.moneyTextInput}
      />
    </View>
  );
};

export default MoneyInput;