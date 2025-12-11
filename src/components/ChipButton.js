import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAppStyles } from '../styles/AppStyles';
const ChipButton = ({ label, selected, error, onPress, accessibilityLabel, }) => {
    const { theme } = useTheme();
    const styles = getAppStyles(theme);
    return (<TouchableOpacity style={[
            styles.chip,
            selected && styles.chipSelected,
            error && styles.chipError,
        ]} onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} accessibilityState={{ selected }}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>);
};
export default ChipButton;
