/**
 * @file_intent Toont een laadscherm aan de gebruiker terwijl de applicatie wordt geïnitialiseerd.
 * @repo_architecture Mobile Industry (MI) - Presentation Layer (UI Component).
 * @term_definition ActivityIndicator = Een React Native component dat een visuele laad-indicator (spinner) toont.
 * @contract Dit is een puur, stateless presentatie-component. Het heeft geen props, voert geen logica uit en is enkel bedoeld voor weergave tijdens het laden.
 * @ai_instruction Dit scherm wordt door een orchestrator (zoals `UIOrchestrator`) getoond tijdens de opstartfase van de app. De styling wordt centraal beheerd via `useAppStyles`. De laadtekst kan hier direct worden aangepast.
 */
import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

const SplashScreen: React.FC = () => {
  const { styles, colors } = useAppStyles();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.screenTitle}>Phoenix wordt geladen...</Text>
    </View>
  );
};

export default SplashScreen;