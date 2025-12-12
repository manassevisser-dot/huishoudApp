// src/screens/Settings/SettingsScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '../../styles/useAppStyles';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  onClose: () => void;
};

const SettingsScreen: React.FC<Props> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const { styles, colors } = useAppStyles();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
          <Text style={styles.pageTitle}>Settings</Text>

          {/* Dark Mode Toggle */}
          <View style={[styles.dashboardCard, { marginBottom: 16 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.label}>Dark mode</Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              />
            </View>
            <Text style={styles.summaryDetail}>
              Status: {theme === 'dark' ? 'Aan' : 'Uit'}
            </Text>
          </View>

          {/* Notifications Toggle */}
          <View style={[styles.dashboardCard, { marginBottom: 16 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.label}>Meldingen</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>
            <Text style={styles.summaryDetail}>
              Status: {notificationsEnabled ? 'Aan' : 'Uit'} (Placeholder functie)
            </Text>
          </View>

        </ScrollView>
      </View>

      {/* Footer */}
      <View style={[styles.buttonContainer, { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug naar Options</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
