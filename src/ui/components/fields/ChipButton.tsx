// src/ui/components/fields/ChipButton.tsx

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import type { ChipViewModel } from '../../../domain/registry/ComponentRegistry';

interface ChipButtonProps {
  viewModel: ChipViewModel;
}

/**
 * DUMB ChipButton
 * Geen logica, geen style-berekeningen.
 * Alles is pre-computed door ComponentOrchestrator.
 */
const ChipButton: React.FC<ChipButtonProps> = ({ viewModel }) => {
  return (
    <TouchableOpacity
      style={viewModel.containerStyle}
      onPress={viewModel.onPress}
      accessibilityRole="button"
      accessibilityLabel={viewModel.accessibilityLabel}
      accessibilityState={viewModel.accessibilityState}
    >
      <Text style={viewModel.textStyle}>
        {viewModel.label}
      </Text>
    </TouchableOpacity>
  );
};

export default ChipButton;