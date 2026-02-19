// @ts-nocheck
// src/ui/screens/Options/OptionsScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';

type Props = {
  onClose: () => void;
  onSettings: () => void;
  onCsvUpload: () => void;
  onReset: () => void;
};

const OptionsScreen: React.FC<Props> = ({ onClose, onSettings, onCsvUpload, onReset }) => {
  const insets = useSafeAreaInsets();
  const { styles, _colors } = useAppStyles();

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        >
          <Text style={styles.screenTitle}>Options</Text>

          <TouchableOpacity
            style={[styles.button, { marginBottom: 16, marginLeft: 0 }]}
            onPress={onSettings}
          >
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginBottom: 16, marginLeft: 0 }]}
            onPress={onCsvUpload}
          >
            <Text style={styles.buttonText}>CSV upload</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginBottom: 16, marginLeft: 0 }]}
            onPress={onReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View
        style={[
          styles.buttonContainer,
          { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) },
        ]}
      >
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug naar Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OptionsScreen;
