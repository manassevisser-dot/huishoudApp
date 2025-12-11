//=====
// src/screens/Options/OptionsScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { getAppStyles } from '../../styles/AppStyles';
const OptionsScreen = ({ onClose, onSettings, onCsvUpload, onReset }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const styles = getAppStyles(theme);
    return (<View style={styles.container}>
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
          <Text style={styles.pageTitle}>Options</Text>
          
          <TouchableOpacity style={[styles.button, { marginBottom: 16, marginLeft: 0 }]} onPress={onSettings}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, { marginBottom: 16, marginLeft: 0 }]} onPress={onCsvUpload}>
            <Text style={styles.buttonText}>CSV upload</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, { marginBottom: 16, marginLeft: 0 }]} onPress={onReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={[styles.buttonContainer, { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug naar Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>);
};
export default OptionsScreen;
