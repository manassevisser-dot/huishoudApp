import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles/AppStyles';

export type ChipButtonProps = {
  label: string;
  selected: boolean;
  error?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

const ChipButton: React.FC<ChipButtonProps> = ({
  label,
  selected,
  error,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.chipSelected,
        error && styles.chipError,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ChipButton;
