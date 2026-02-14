import React from 'react';
import { View, Text, TextInput } from 'react-native';
import type { TextViewModel } from '@ui/types/viewModels';

interface MoneyInputProps {
  viewModel: TextViewModel;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({ viewModel }) => {
  return (
    <View style={viewModel.containerStyle}>
      <Text style={viewModel.labelStyle}>{viewModel.label}</Text>
      
      <TextInput
        style={viewModel.labelStyle}
        value={viewModel.value}
        onChangeText={viewModel.onChangeText}
        placeholder={viewModel.placeholder}
        keyboardType="decimal-pad"
      />

{(viewModel.error !== null && viewModel.error !== undefined && viewModel.error !== '') ? (
  <Text style={viewModel.errorStyle}>{viewModel.error}</Text>
) : null}
    </View>
  );
};

export default MoneyInput;