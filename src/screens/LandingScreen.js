//====
// src/screens/LandingScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getAppStyles } from '../styles/AppStyles';
const LandingScreen = ({ onSignup, onSignin }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const styles = getAppStyles(theme);
    return (<View style={[
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
        <TouchableOpacity style={styles.button} onPress={onSignup} accessibilityRole="button" accessibilityLabel="Aanmelden en starten met setup">
          <Text style={styles.buttonText}>Aanmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onSignin} accessibilityRole="button" accessibilityLabel="Inloggen en ga naar dashboard">
          <Text style={styles.secondaryButtonText}>Inloggen</Text>
        </TouchableOpacity>
      </View>
    </View>);
};
export default LandingScreen;
