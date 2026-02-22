/**
 * @file_intent Definieert het `ResetScreen`, een UI-component dat gebruikers de mogelijkheid biedt om de applicatiegegevens te wissen of de setup-wizard te herstellen. Dit scherm is cruciaal voor gebruikers die opnieuw willen beginnen of configuratiefouten willen corrigeren.
 * @repo_architecture UI Layer - Screen. Dit scherm wordt door de `MainNavigator` gepresenteerd en ontvangt callback-functies (`onWissen`, `onHerstel`) om de reset-logica, die buiten het UI-domein ligt, aan te roepen.
 * @term_definition
 *   - `Alert.alert`: Een standaard React Native API om een native dialoogvenster te tonen. Dit wordt gebruikt om de gebruiker te waarschuwen voor de destructieve aard van de acties.
 *   - `onWissen`: Een callback-prop die wordt aangeroepen wanneer de gebruiker bevestigt dat alle data gewist moet worden.
 *   - `onHerstel`: Een callback-prop die wordt aangeroepen wanneer de gebruiker bevestigt dat de setup-wizard gereset moet worden.
 * @contract Het component rendert twee hoofdacties: "WISSEN" en "HERSTEL". Voordat een actie wordt uitgevoerd, toont het een `Alert`-dialoog ter bevestiging. Bij bevestiging worden de respectievelijke `on...`-props aangeroepen. De daadwerkelijke logica voor het wissen en herstellen is gedelegeerd aan de aanroeper (de `MainNavigator` en de daaronder liggende orchestrators).
 * @ai_instruction Bij het aanpassen van de waarschuwingsteksten, zorg ervoor dat de `Alert.alert`-parameters (`title`, `message`, en de knop-teksten) duidelijk en ondubbelzinnig de gevolgen van de actie beschrijven. De destructieve actie (`WISSEN`) moet visueel en tekstueel worden benadrukt (bijv. rode knop, hoofdletters, `style: 'destructive'`).
 */
// src/ui/screens/Reset/ResetScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';

type Props = {
  onClose: () => void;
  onWissen: () => void;
  onHerstel: () => void;
};

const ResetScreen: React.FC<Props> = ({ onWissen, onHerstel }) => {
  const insets = useSafeAreaInsets();
  const { styles } = useAppStyles();

  const handleWissen = () => {
    Alert.alert(
      'WISSEN - Alle data verwijderen',
      'Dit verwijdert ALLE data inclusief setup, transacties en instellingen. Deze actie kan niet ongedaan worden gemaakt.',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'WISSEN', style: 'destructive', onPress: onWissen },
      ],
    );
  };

  const handleHerstel = () => {
    Alert.alert(
      'HERSTEL - Setup opnieuw doorlopen',
      'Dit reset de setup wizard naar lege velden. Uw transacties en instellingen blijven behouden.',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'HERSTEL', onPress: onHerstel },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        >
          <Text style={styles.screenTitle}>Reset Opties</Text>

          <View style={[styles.dashboardCard, { marginBottom: 24 }]}>
            <Text style={[styles.entryLabel, { marginBottom: 8 }]}>WISSEN</Text>
            <Text style={styles.summaryDetail}>
              Verwijdert ALLE data: setup, transacties, en instellingen. U moet de app opnieuw
              instellen.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#FF3B30', marginTop: 16, marginLeft: 0 }]}
              onPress={handleWissen}
            >
              <Text style={styles.buttonText}>WISSEN</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.dashboardCard, { marginBottom: 24 }]}>
            <Text style={[styles.entryLabel, { marginBottom: 8 }]}>HERSTEL</Text>
            <Text style={styles.summaryDetail}>
              Reset alleen de setup wizard naar lege velden. Transacties en instellingen blijven
              behouden.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#007AFF', marginTop: 16, marginLeft: 0 }]}
              onPress={handleHerstel}
            >
              <Text testID= 'herstel' style={styles.buttonText}>HERSTEL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ResetScreen;
