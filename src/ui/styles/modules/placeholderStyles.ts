// src/ui/styles/modules/placeholderStyles.ts
import { StyleSheet } from 'react-native';

export const placeholderStyles = StyleSheet.create({
  // Algemene placeholder voor containers
  screenContainer: { backgroundColor: '#fff0f0', height: 20 },
  wizardPageContainer: { backgroundColor: '#f0f0ff', height: 20 },
  fieldsContainer: { backgroundColor: '#f0fff0', height: 20 },

  // Tekst-gerelateerd
  screenTitle: { backgroundColor: '#ffe0e0', height: 16 },
  fieldCountText: { backgroundColor: '#e0ffe0', height: 14 },
  textArea: { backgroundColor: '#f0f8ff', height: 100 },

  // Knoppen
  primaryButton: { backgroundColor: '#e0e0ff', height: 40 },
  buttonDisabled: { backgroundColor: '#ddd', height: 40 },
  debugButton: { backgroundColor: '#ffebcc', height: 30 },
});