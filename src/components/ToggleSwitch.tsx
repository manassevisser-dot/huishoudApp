import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/AppStyles';

export type ToggleSwitchProps = {
  value: boolean;
  onToggle: () => void;
  labelTrue?: string;
  labelFalse?: string;
  accessibilityLabel?: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onToggle,
  labelTrue = 'Ja',
  labelFalse = 'Nee',
  accessibilityLabel,
}) => {
  return (
    <View style={styles.toggleWrapper}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          value ? styles.toggleActive : styles.toggleInactive,
        ]}
        onPress={onToggle}
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ checked: value }}>
        <Text style={styles.toggleText}>{value ? labelTrue : labelFalse}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ToggleSwitch;
