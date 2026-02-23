/**
 * @file_intent Toont een welkomstscherm aan de gebruiker aan het begin van de wizard-flow.
 * @repo_architecture Mobile Industry (MI) - Presentation Layer (UI Component).
 * @term_definition Wizard = Een begeleide, stapsgewijze gebruikersinterface voor het voltooien van een taak.
 * @contract Dit is een puur presentatie-component zonder interactieve elementen of state management. Het is bedoeld als het startpunt van de wizard.
 * @ai_instruction De tekstinhoud kan worden aangepast. Voor complexere welkomstschermen met bijvoorbeeld afbeeldingen of knoppen, kan dit component worden uitgebreid. De styling wordt centraal beheerd via `useAppStyles`.
 */
import * as React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

const WelcomeWizard: React.FC = () => {
  const { styles } = useAppStyles();
  
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Welkom bij de nieuwe Cashflow Wizard.</Text>
    </View>
  );
};

export default WelcomeWizard;