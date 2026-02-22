/**
 * @file_intent Definieert het `OptionsScreen`, een UI-component dat fungeert als een centraal menu voor het navigeren naar verschillende applicatie-instellingen en -functies, zoals csv-upload en het resetten van de applicatie.
 * @repo_architecture UI Layer - Screen. Dit component is een primair scherm in de navigatie-graaf van de applicatie. Het ontvangt navigatiefuncties (on...) als props van de bovenliggende navigator (`MainNavigator`) om gebruikersacties af te handelen.
 * @term_definition
 *   - `useSafeAreaInsets`: Een hook van `react-native-safe-area-context` om te voorkomen dat UI-elementen worden overlapt door fysieke scherm-inkepingen of home-indicatoren.
 *   - `onClose`, `onSettings`, etc.: Callback-props die vanuit de navigator worden doorgegeven om het scherm los te koppelen van de navigatielogica. De verantwoordelijkheid van het scherm is om deze functies aan te roepen, niet om te weten hoe de navigatie is geïmplementeerd.
 * @contract Het component rendert een lijst met knoppen. Wanneer een knop wordt ingedrukt, roept het de bijbehorende functie-prop aan (bijv. het indrukken van "Settings" roept de `onSettings`-prop aan). Het is een "dom" component dat volledig afhankelijk is van zijn props voor functionaliteit.
 * @ai_instruction Om een nieuwe optie aan dit scherm toe te voegen, moet je: 1. Een nieuwe functie-prop toevoegen aan het `Props`-type (bijv. `onNewFeature: () => void;`). 2. De nieuwe prop toevoegen aan de functiesignatuur. 3. Een nieuw `<TouchableOpacity>`-component toevoegen dat deze nieuwe prop aanroept in zijn `onPress`-handler. 4. De bovenliggende navigator (`MainNavigator.tsx`) bijwerken om de implementatie voor de nieuwe prop te leveren.
 */
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
            <Text style={styles.buttonText}>csv upload</Text>
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
