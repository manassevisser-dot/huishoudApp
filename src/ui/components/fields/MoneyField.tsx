import React from 'react';
import { View, Text } from 'react-native';
import type { CurrencyViewModel } from '@ui/types/viewModels';

interface MoneyFieldProps {
  viewModel: CurrencyViewModel;
}

export const MoneyField: React.FC<MoneyFieldProps> = ({ viewModel }) => {
  return (
    <View style={viewModel.containerStyle}>
      <Text style={viewModel.labelStyle}>{viewModel.label}</Text>
      
      <View style={viewModel.containerStyle}>
        <Text style={viewModel.labelStyle}>
          {viewModel.value.toString()}
        </Text>
      </View>

      {(viewModel.error !== null && viewModel.error !== undefined && viewModel.error !== '') ? (
        <Text style={viewModel.errorStyle}>{viewModel.error}</Text>
      ) : null}
    </View>
  );
};

export default MoneyField;