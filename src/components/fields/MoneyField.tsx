import React, { useState, useEffect } from 'react';
import { TextInput, View, Text } from 'react-native';
import { useFormContext } from '@context/FormContext';
import { formatCurrency } from '@utils/numbers';
import { useAppStyles } from '@ui/styles/useAppStyles';

interface Props {
  pageId: string;
  fieldId: string;
  label?: string;
  placeholder?: string;
}

export const MoneyField: React.FC<Props> = ({ pageId, fieldId, label }) => {
  const { styles } = useAppStyles();
  const { state, updateField } = useFormContext();
  
  // Phoenix-standaard: we halen de waarde op uit de specifieke sectie (C7/C10)
  // De state slaat dit op als integers (centen)
  const valueInCents = state[pageId]?.[fieldId] || 0;
  
  // Lokale staat voor wat de gebruiker typt (bijv. "10,50")
  const [inputValue, setInputValue] = useState('');

  // Synchroniseer lokale input met de globale state (bij initialisatie)
  useEffect(() => {
    if (valueInCents > 0) {
      // Formatteer centen naar leesbare euro's zonder het symbool
      const formatted = formatCurrency(valueInCents).replace('€', '').trim();
      setInputValue(formatted);
    }
  }, []);

  const handleTextChange = (text: string) => {
    // 1. Schoon de input op (sta alleen cijfers en één komma/punt toe)
    const sanitized = text.replace(/[^0-9,.-]/g, '');
    setInputValue(sanitized);

    // 2. Converteer naar centen-integer
    // We vervangen de komma door een punt voor parseFloat en vermenigvuldigen met 100
    const floatValue = parseFloat(sanitized.replace(',', '.')) || 0;
    const cents = Math.round(floatValue * 100);

    // 3. Update de globale state via Phoenix updateField
    updateField(pageId, fieldId, cents);
  };

  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View style={styles.moneyInputWrapper}>
        <Text style={styles.currencySymbol}>€</Text>
        <TextInput
          value={inputValue}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          placeholder="0,00"
          style={styles.textInput}
          onBlur={() => {
            // Optioneel: Formatteer de input netjes bij het verlaten van het veld
            setInputValue(formatCurrency(valueInCents).replace('€', '').trim());
          }}
        />
      </View>
    </View>
  );
};

export default MoneyField;