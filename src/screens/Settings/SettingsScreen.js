//====
// src/screens/Settings/SettingsScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { getAppStyles } from '../../styles/AppStyles';
const SettingsScreen = ({ onClose }) => {
    const insets = useSafeAreaInsets();
    const { theme, setTheme } = useTheme();
    const styles = getAppStyles(theme);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };
    return (<View style={styles.container}>
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
          <Text style={styles.pageTitle}>Settings</Text>
          
          <View style={styles.dashboardCard}>
            <Text style={styles.summaryLabelBold}>Thema</Text>
            <Text style={styles.summaryDetail}>
              Kies tussen een licht of donker thema voor de app.
            </Text>
            <TouchableOpacity style={styles.button} onPress={toggleTheme}>
              <Text style={styles.buttonText}>
                Switch naar {theme === 'light' ? 'Donker' : 'Licht'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      <View style={[styles.buttonContainer, { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug</Text>
        </TouchableOpacity>
      </View>
    </View>);
};
export default SettingsScreen;
