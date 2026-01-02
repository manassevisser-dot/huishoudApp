import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { useForm } from '@app/context/FormContext';

interface Props {
  onSignup?: () => void; // Voor testen/storybook
}

const LandingScreen: React.FC<Props> = ({ onSignup }) => {
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();
  const { dispatch } = useForm();

  const handleStart = () => {
    if (onSignup) onSignup();
    dispatch({ type: 'SET_STEP', payload: 'WIZARD' });
  };

  const handleLogin = () => {
    dispatch({ type: 'SET_STEP', payload: 'DASHBOARD' });
  };

  return (
    <View 
      testID="landing-screen"
      style={[styles.container, { paddingBottom: Math.max(20, (insets?.bottom || 0) + 8) }]}
    >
      <View style={styles.pageContainer}>
        <Text testID="landing-title" style={styles.pageTitle}>Welkom</Text>
        <Text style={styles.summaryDetail}>
          Start met het instellen van uw huishouding of ga direct naar het dashboard.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          testID="btn-aanmelden"
          style={styles.button} 
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Aanmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          testID="btn-inloggen"
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleLogin}
        >
          <Text style={styles.secondaryButtonText}>Inloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;
