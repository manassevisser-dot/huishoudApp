/**
 * @file_intent Definieert het `CsvUploadScreen`, een UI-component waarmee gebruikers een csv-bestand kunnen selecteren en uploaden voor verwerking.
 * @repo_architecture UI Layer - Screen. Dit scherm is verantwoordelijk voor de presentatie van de upload-functionaliteit. Het ontvangt de `onPickFile` callback en de `isUploading` status als props. De logica voor het daadwerkelijk verwerken van het bestand bevindt zich in een hoger gelegen orchestrator (`ImportOrchestrator`).
 * @term_definition
 *   - `onPickFile`: Een callback-prop die wordt aangeroepen wanneer de gebruiker op de upload-knop tikt. Deze functie initieert het proces voor het selecteren van een bestand via de `FilePickerAdapter`.
 *   - `isUploading`: Een boolean-prop die aangeeft of er momenteel een upload- en verwerkingsoperatie gaande is. Dit wordt gebruikt om de knop uit te schakelen en een `ActivityIndicator` weer te geven.
 *   - `ActivityIndicator`: Een standaard React Native component dat een visuele spinner toont om aan te geven dat een proces (zoals uploaden) actief is.
 * @contract Het component rendert een knop. Wanneer op de knop wordt geklikt, wordt de `onPickFile`-functie aangeroepen. Als `isUploading` waar is, wordt de knop uitgeschakeld en wordt een laadindicator getoond. Het is een presentatie-component dat zijn staat via props ontvangt.
 * @ai_instruction Om de styling van dit scherm aan te passen, gebruik de stijlen die via `useAppStyles` worden geleverd in plaats van de verouderde `placeholderStyles`. De `placeholderStyles` worden uitgefaseerd. Om de tekst op de knop of de titel van het scherm te wijzigen, pas de constanten in `UI_SECTIONS` aan in plaats van hardcoded strings te gebruiken.
 */
// src/ui/screens/csv/CsvUploadScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { useAppStyles } from '@ui/styles/useAppStyles';

interface CsvUploadScreenProps {
  onPickFile: () => void;
  isUploading: boolean;
}

export const CsvUploadScreen: React.FC<CsvUploadScreenProps> = ({ onPickFile, isUploading }) => {
  const { styles } = useAppStyles();

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>{UI_SECTIONS.CSV_UPLOAD}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onPickFile}
        disabled={isUploading}
        testID="Kies csv-bestand"
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kies csv-bestand</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CsvUploadScreen;
