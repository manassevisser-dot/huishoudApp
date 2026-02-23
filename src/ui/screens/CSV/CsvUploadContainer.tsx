// src/ui/screens/csv/CsvUploadContainer.tsx
/**
 * @file_intent Stateful container voor het CSV-upload proces.
 *   Verbindt FilePickerAdapter, MasterOrchestrator en CsvUploadScreen.
 * @repo_architecture UI Layer - Container Component.
 *   Volgt het DailyInputActionFooter-patroon: useMaster() voor orchestrator-toegang,
 *   lokale useState voor UI-state, pure child-component voor presentatie.
 * @term_definition
 *   isUploading = Lokale boolean: true tijdens pickAndReadCsvFile() + handleCsvImport().
 *   error = Lokale string: laatste foutmelding. null als er geen fout is.
 * @contract
 *   Roept pickAndReadCsvFile() aan → geeft { text, fileName, detectedBank }.
 *   Roept master.handleCsvImport({ csvText, fileName, bank }) aan.
 *   Bij success: navigeert naar CSV_ANALYSIS via master.navigation.goToCsvAnalysis().
 *   Bij annulering (gebruiker drukt 'Cancel'): geen foutmelding, gewoon stoppen.
 *   Bij echte fout: toont foutmelding in lokale state.
 * @ai_instruction
 *   CsvUploadScreen is een dom presentatie-component — geef het alleen onPickFile + isUploading.
 *   Annulering ('Bestand selecteren geannuleerd') is geen fout — geen error state tonen.
 *   handlePickFile is async maar wordt via een sync onPress-callback aangeroepen —
 *     gebruik void operator om de ESLint floating-promise warning te onderdrukken.
 */
import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { pickAndReadCsvFile } from '@adapters/system/FilePickerAdapter';
import { CsvUploadScreen } from '@ui/screens/csv/CsvUploadScreen';

const ANNULERING_MESSAGE = 'Bestand selecteren geannuleerd';

export const CsvUploadContainer: React.FC = () => {
  const master = useMaster();
  const { styles, colors, Tokens } = useAppStyles();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickFile = useCallback(async () => {
    setError(null);
    setIsUploading(true);

    try {
      const { text, fileName, detectedBank } = await pickAndReadCsvFile();

      await master.handleCsvImport({
        csvText: text,
        fileName,
        bank: detectedBank,
      });

      // Navigeer naar analyse-resultaat na succesvolle import
      master.navigation.goToCsvAnalysis();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Onbekende fout bij importeren';

      // Annulering is geen fout — gebruiker heeft bewust geannuleerd
      if (message !== ANNULERING_MESSAGE) {
        setError(message);
      }
    } finally {
      setIsUploading(false);
    }
  }, [master]);

  return (
    <View style={styles.screenContainer}>
      <CsvUploadScreen
        onPickFile={() => { void handlePickFile(); }}
        isUploading={isUploading}
      />

      {error !== null && (
        <View
          style={{
            marginHorizontal: Tokens.Space.md,
            marginTop: Tokens.Space.sm,
            padding: Tokens.Space.md,
            borderRadius: 8,
            backgroundColor: colors.error + '1A', // 10% opacity
          }}
        >
          <Text style={{ color: colors.error, fontSize: 13, fontWeight: '600' }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};
