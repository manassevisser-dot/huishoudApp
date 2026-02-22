/**
 * @file_intent Biedt de gebruiker een primair startpunt in de applicatie, met de keuze om de setup-wizard te starten of direct naar het dashboard te gaan.
 * @repo_architecture Mobile Industry (MI) - Presentation Layer (UI Component).
 * @term_definition onStartWizard = Callback-functie om de wizard-flow te initiëren. onGoToDashboard = Callback-functie voor directe navigatie naar het hoofddashboard. SafeAreaInsets = Een hook om te zorgen dat UI-elementen niet worden bedekt door fysieke scherm-elementen zoals de notch of de home-indicator.
 * @contract Puur presentatie-component dat twee navigatie-callbacks (`onStartWizard`, `onGoToDashboard`) als props ontvangt. Het orkestreert geen navigatie zelf, maar delegeert dit aan een bovenliggende controller (bijv. UIOrchestrator).
 * @ai_instruction Dit is het hoofdkeuzescherm voor nieuwe of niet-ingelogde gebruikers. De navigatielogica wordt afgehandeld door de parent-component die de callbacks levert. De styling en layout (inclusief `SafeAreaInsets`) worden in dit component beheerd. Pas de button-teksten of de welkomstboodschap hier direct aan.
 */
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@styles/useAppStyles';

interface Props {
  onStartWizard: () => void;
  onGoToDashboard: () => void;
}
const max = 20;
const ins = 8;
const LandingScreen: React.FC<Props> = ({ onStartWizard, onGoToDashboard }) => {
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(max, insets.bottom + ins) }]}>
      <View style={styles.screenContainer}>
        <Text style={styles.screenTitle}>Welkom</Text>
        <Text style={styles.summaryDetail}>
          Start met het instellen van uw huishouding of ga direct naar het dashboard.
        </Text>
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.button} onPress={onStartWizard}>
          <Text style={styles.buttonText}>Aanmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onGoToDashboard}>
          <Text style={styles.secondaryButtonText}>Inloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;