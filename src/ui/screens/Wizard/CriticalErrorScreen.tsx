/**
 * @file_intent Toont een onherstelbare fout-staat aan de gebruiker, met een call-to-action om de applicatie te resetten.
 * @repo_architecture Mobile Industry (MI) - Presentation Layer (UI Component).
 * @term_definition onReset = Callback-functie die wordt aangeroepen wanneer de gebruiker de reset-knop activeert. Deze functie moet de applicatie-staat naar een veilige, initiële toestand terugbrengen.
 * @contract Dit is een puur presentatie-component. Het ontvangt een `onReset` functie als prop en is verantwoordelijk voor de weergave van de foutmelding. Het bevat geen applicatielogica buiten het aanroepen van de `onReset` callback.
 * @ai_instruction Gebruik dit scherm als een "last resort" wanneer data-integriteit niet gegarandeerd kan worden. De styling wordt centraal beheerd via `useAppStyles`. De `onReset` logica moet worden geïmplementeerd door een bovenliggende orchestrator of context provider.
 */
import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

type Props = { onReset: () => void };

const CriticalErrorScreen: React.FC<Props> = ({ onReset }) => {
  const { styles } = useAppStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>
        Er is een kritieke fout opgetreden in de data-integriteit.
      </Text>
      <Button title="Reset Applicatie" onPress={onReset} color="red" />
    </View>
  );
};
export default CriticalErrorScreen;
