import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import type { ToggleViewModel } from '@ui/types/viewModels';

interface ToggleSwitchProps {
  viewModel: ToggleViewModel;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ viewModel }) => {
  return (
    <View style={viewModel.containerStyle}>
      <Text style={viewModel.labelStyle}>{viewModel.label}</Text>

      <TouchableOpacity
        style={viewModel.containerStyle} 
        onPress={() => viewModel.onToggle(!viewModel.value)}
        accessibilityRole="switch"
        accessibilityState={{ checked: viewModel.value }}
      >
        <Text style={viewModel.labelStyle}>
          {viewModel.value ? viewModel.labelTrue : viewModel.labelFalse}
        </Text>
      </TouchableOpacity>

      {(viewModel.error !== null && viewModel.error !== undefined && viewModel.error !== '') ? (
        <Text style={viewModel.errorStyle}>{viewModel.error}</Text>
      ) : null}
    </View>
  );
};

export default ToggleSwitch;