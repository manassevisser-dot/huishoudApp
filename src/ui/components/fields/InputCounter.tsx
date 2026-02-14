import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { CounterViewModel } from '@ui/types/viewModels';

interface InputCounterProps {
  viewModel: CounterViewModel;
}

export const InputCounter: React.FC<InputCounterProps> = ({ viewModel }) => {
  const handlePress = (delta: number) => {
    viewModel.onUpdate(viewModel.value + delta);
  };

  return (
    <View style={viewModel.containerStyle}>
      <Text style={viewModel.labelStyle}>{viewModel.label}</Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => handlePress(-1)}>
          <Text>-</Text>
        </TouchableOpacity>

        <Text>{viewModel.value}</Text>

        <TouchableOpacity onPress={() => handlePress(1)}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      {(viewModel.error !== null && viewModel.error !== undefined && viewModel.error !== '') ? (
        <Text style={viewModel.errorStyle}>{viewModel.error}</Text>
      ) : null}
    </View>
  );
};

export default InputCounter;