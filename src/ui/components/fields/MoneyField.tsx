import * as React from 'react';
import { View, Text, TextInput } from 'react-native';

export interface MoneyFieldProps {
  label: string;
  amount: number; // We gebruiken 'amount' zoals geëist door de compiler in DailyInput
  onAmountChange: (val: number) => void;
  error?: string;
}

export const MoneyField: React.FC<MoneyFieldProps> = ({ label, amount, onAmountChange, error }) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontWeight: '600', marginBottom: 5 }}>{label}</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: error ? 'red' : '#ccc',
          padding: 12,
          borderRadius: 8,
          fontSize: 18,
        }}
        keyboardType="numeric"
        value={amount.toString()}
        onChangeText={(text) => {
          const num = parseFloat(text.replace(',', '.'));
          onAmountChange(isNaN(num) ? 0 : num);
        }}
        placeholder="0.00"
      />
      {error && <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>}
    </View>
  );
};
export default MoneyField;
