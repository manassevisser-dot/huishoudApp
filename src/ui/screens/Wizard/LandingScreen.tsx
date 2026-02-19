import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@styles/useAppStyles';

interface Props {
  onStartWizard: () => void;
  onGoToDashboard: () => void;
}
const max = 20;
const ins = 8;
const LandingScreen: React.FC<Props> = ({ onStartWizard, onGoToDashboard }) => {
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(max, insets.bottom + ins) }]}>
      <View style={styles.screenContainer}>
        <Text style={styles.screenTitle}>Welkom</Text>
        <Text style={styles.summaryDetail}>
          Start met het instellen van uw huishouding of ga direct naar het dashboard.
        </Text>
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.button} onPress={onStartWizard}>
          <Text style={styles.buttonText}>Aanmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onGoToDashboard}>
          <Text style={styles.secondaryButtonText}>Inloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;