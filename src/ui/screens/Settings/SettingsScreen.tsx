/**
 * @file_intent Definieert het `SettingsScreen`, een UI-component waar gebruikers applicatie-specifieke voorkeuren kunnen aanpassen, zoals het kleurenthema.
 * @repo_architecture UI Layer - Screen. Dit component is een presentatie-component dat de `useTheme` hook gebruikt om de thema-staat te lezen en bij te werken. De navigatie (het sluiten van het scherm) wordt afgehandeld via de `onClose` prop, die door een bovenliggende navigator wordt geleverd.
 * @term_definition
 *   - `useTheme`: Een custom hook die toegang geeft tot de huidige thema-staat (`theme`) en een functie om deze te wijzigen (`setTheme`). Deze hook is afkomstig van de `ThemeProvider`.
 *   - `Switch`: Een standaard React Native UI-element dat een aan/uit-schakelaar rendert.
 *   - `insets`: Een object van `useSafeAreaInsets` dat opvulling definieert om te voorkomen dat de UI wordt verborgen achter fysieke apparaat-inkepingen.
 * @contract Het component rendert een of meer instellingen. De "Dark mode"-schakelaar leest zijn waarde uit de `ThemeContext` en roept `setTheme` aan bij wijziging. De "Meldingen"-schakelaar is een placeholder en beheert alleen zijn eigen lokale staat. Het scherm biedt een "Terug"-knop die de `onClose`-prop aanroept.
 * @ai_instruction Om een nieuwe, persistente instelling toe te voegen, moet je eerst de `SettingsProvider` (of een vergelijkbare state manager) aanpassen om de nieuwe staat op te slaan. Vervolgens voeg je in dit scherm een nieuw `View`-blok toe met een `Switch` of een ander besturingselement. Verbind dit besturingselement met de nieuwe staat uit de provider. De `notificationsEnabled`-state is een goed voorbeeld van een tijdelijke, lokale implementatie die moet worden vervangen door een globale state manager voor een echte implementatie.
 */
// src/ui/screens/Settings/SettingsScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { useTheme } from '@ui/providers/ThemeProvider';

type Props = {
  onClose: () => void;
};

const SettingsScreen: React.FC<Props> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const { styles } = useAppStyles();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        >
          <Text style={styles.screenTitle}>Settings</Text>

          {/* Dark Mode Toggle */}
          <View style={[styles.dashboardCard, { marginBottom: 16 }]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={styles.entryLabel}>Dark mode</Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              />
            </View>
            <Text style={styles.summaryDetail}>Status: {theme === 'dark' ? 'Aan' : 'Uit'}</Text>
          </View>

          {/* Notifications Toggle */}
          <View style={[styles.dashboardCard, { marginBottom: 16 }]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={styles.entryLabel}>Meldingen</Text>
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>
            <Text style={styles.summaryDetail}>
              Status: {notificationsEnabled ? 'Aan' : 'Uit'} (Placeholder functie)
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View
        style={[
          styles.buttonContainer,
          { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) },
        ]}
      >
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug naar Options</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
