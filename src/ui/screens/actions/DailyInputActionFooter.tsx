//src/ui/screens/actions/DailyInputActionFooter.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';

interface DailyInputActionFooterProps {
  onSave: () => void;
}

type FooterStyles = {
  buttonContainer: StyleProp<ViewStyle>;
  button: StyleProp<ViewStyle>;
  buttonText: StyleProp<TextStyle>;
};

export const DailyInputActionFooter: React.FC<DailyInputActionFooterProps> = ({ onSave }) => {
  const insets = useSafeAreaInsets();
  const { styles, Tokens } = useAppStyles();
  const s = styles as unknown as FooterStyles;
  const bottomSpace = Math.max(insets.bottom, Tokens.Space.lg);

  return (
    <View style={[s.buttonContainer, { paddingBottom: bottomSpace }]}>
      <TouchableOpacity style={s.button} onPress={onSave}>
        <Text style={s.buttonText}>Opslaan & Terug</Text>
      </TouchableOpacity>
    </View>
  );
};

