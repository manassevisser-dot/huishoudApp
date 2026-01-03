import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

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
  const { styles, colors } = useAppStyles() as any;

  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, error && styles.chipError]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default ChipButton;
