import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '../../styles/useAppStyles';
import { useForm } from '../../../app/context/FormContext';

interface Props {
  onSignup?: () => void;
  onSignin?: () => void;
}

const LandingScreen: React.FC<Props> = ({ onSignup, onSignin }) => {
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();
  const { dispatch } = useForm();

  // Phoenix 2025 logica: we gebruiken de SET_STEP actie uit FormAction
  const handleStart = () => {
    if (onSignup) {
      onSignup();
    }
    // Aangepast naar SET_STEP omdat SET_VALUE niet bestaat in je types
    dispatch({ type: 'SET_STEP', payload: 'WIZARD' });
  };

  const handleLogin = () => {
    if (onSignin) {
      onSignin();
    }
    // Aangepast naar SET_STEP omdat SET_VALUE niet bestaat in je types
    dispatch({ type: 'SET_STEP', payload: 'DASHBOARD' });
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
      <View style={styles.pageContainer}>
        <Text style={styles.pageTitle}>Welkom</Text>
        <Text style={styles.summaryDetail}>
          Start met het instellen van uw huishouding of ga direct naar het dashboard.
        </Text>
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Aanmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity 
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