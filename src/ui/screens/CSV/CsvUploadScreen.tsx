import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { placeholderStyles } from '@ui/styles/modules/placeholderStyles';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';

interface ImportResult {
  transactions: Array<{
    id: string;
    amount: number;
    description: string;
  }>;
}

interface FormStateOrchestrator {
  importCsvData: (csvText: string) => Promise<ImportResult>;
}

interface CsvUploadScreenProps {
  formStateOrchestrator: FormStateOrchestrator;
}

export const CsvUploadScreen: React.FC<CsvUploadScreenProps> = ({
  formStateOrchestrator
}) => {
  const [csvText, setCsvText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const isButtonDisabled = isUploading || csvText.trim() === '';

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const result = await formStateOrchestrator.importCsvData(csvText);

      if (result === null || result === undefined || result.transactions.length === 0) {
        Logger.warn('CSV_IMPORT_EMPTY', { 
          uiTitle: 'Geen resultaat',
          uiMessage: 'Geen geldige transacties gevonden.' 
        });
        return;
      }

      Logger.info('CSV_IMPORT_SUCCESS', { 
        count: result.transactions.length,
        uiTitle: 'Bevestig Upload',
        uiMessage: `Transacties verwerkt: ${result.transactions.length}`
      });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Onbekende fout';
      Logger.error('CSV_IMPORT_FAILED', { 
        error: errorMessage,
        uiTitle: 'Fout',
        uiMessage: 'Fout bij verwerken: ' + errorMessage 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={placeholderStyles.screenContainer}>
      <Text style={placeholderStyles.screenTitle}>{UI_SECTIONS.CSV_UPLOAD}</Text>

      <TextInput
        style={placeholderStyles.textArea}
        value={csvText}
        onChangeText={setCsvText}
        placeholder="Plak CSV-gegevens hier..."
        editable={!isUploading}
        multiline
        numberOfLines={10}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[
          placeholderStyles.primaryButton,
          isButtonDisabled && styles.buttonDisabledState
        ]}
        onPress={() => { void handleUpload(); }}
        disabled={isButtonDisabled}
        testID="Verwerk CSV"
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={placeholderStyles.fieldCountText}>Verwerk CSV</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles verplaatst uit de render-functie
const styles = StyleSheet.create({
  buttonDisabledState: {
    opacity: 0.5,
    backgroundColor: '#ccc', // Of gebruik een UX token als die er is
  }
});

export default CsvUploadScreen;