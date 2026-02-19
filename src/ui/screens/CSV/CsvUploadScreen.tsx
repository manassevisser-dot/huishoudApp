// src/ui/screens/CSV/CsvUploadScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { placeholderStyles } from '@domain/styles/modules/placeholderStyles';

interface CsvUploadScreenProps {
  onPickFile: () => void;
  isUploading: boolean;
}
/***
 * TODO: Connecting to Mainnavigation + Adapter for uploading CSV files.
 */
export const CsvUploadScreen: React.FC<CsvUploadScreenProps> = ({ onPickFile, isUploading }) => {
  return (
    <View style={placeholderStyles.screenContainer}>
      <Text style={placeholderStyles.screenTitle}>{UI_SECTIONS.CSV_UPLOAD}</Text>

      <TouchableOpacity
        style={placeholderStyles.primaryButton}
        onPress={onPickFile}
        disabled={isUploading}
        testID="Kies CSV-bestand"
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={placeholderStyles.entryCountText}>Kies CSV-bestand</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CsvUploadScreen;