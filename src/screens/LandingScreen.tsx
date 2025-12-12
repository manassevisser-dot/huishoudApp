import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import getAppStyles from '../styles/useAppStyles';
const styles = getAppStyles(theme);

type Props = {
  onSignup: () => void; // Start wizard at C1
  onSignin: () => void; // Go to Dashboard
};

const LandingScreen: React.FC<Props> = ({ onSignup, onSignin }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(20, insets.bottom + 8) },
      ]}>
      <View style={styles.pageContainer}>
        <Text style={styles.pageTitle}>Welkom</Text>
        <Text style={styles.summaryDetail}>
          Start met het instellen van uw huishouding of ga direct naar het
          dashboard als u al bekend bent.
        </Text>
      </View>

      <View style={[styles.buttonContainer, { bottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={onSignup}
          accessibilityRole="button"
          accessibilityLabel="Aanmelden en starten met setup">
          <Text style={styles.buttonText}>Aanmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onSignin}
          accessibilityRole="button"
          accessibilityLabel="Inloggen en ga naar dashboard">
          <Text style={styles.secondaryButtonText}>Inloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;
