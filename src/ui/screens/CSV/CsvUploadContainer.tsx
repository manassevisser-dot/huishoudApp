// src/ui/screens/csv/CsvUploadContainer.tsx
import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useMaster } from '@ui/providers/MasterProvider';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { CsvUploadScreen } from './CsvUploadScreen';
import { pickAndReadCsvFile, ANNULERING_MESSAGE } from '@adapters/system/FilePickerAdapter';

// ─── Types voor ErrorBanner ─────────────────────────────────────
type AppColors = ReturnType<typeof useAppStyles>['colors'];
type AppTokens = ReturnType<typeof useAppStyles>['Tokens'];

interface ErrorBannerProps {
  message: string;
  colors: AppColors;
  Tokens: AppTokens;
  testID?: string;  // ← NIEUW: voor testing
}

// ─── Helper: voert CSV-import uit ───────────────────────────────
async function executeCsvImport(
  master: MasterOrchestratorAPI,
): Promise<void> {
  const { text, fileName, detectedBank } = await pickAndReadCsvFile();
  await master.handleCsvImport({ csvText: text, fileName, bank: detectedBank });
  master.navigation.goToCsvAnalysis();
}

// ─── Helper: verwerkt errors ────────────────────────────────────
function handleImportError(
  error: unknown,
  setError: (error: string | null) => void,
): void {
  const message = error instanceof Error ? error.message : 'Onbekende fout bij importeren';
  if (message !== ANNULERING_MESSAGE) {
    setError(message);
  }
}

// ─── Helper component: toont foutmelding ────────────────────────
const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, colors, Tokens, testID }) => (
  <View 
    testID={testID}  // ← NIEUW: testID doorgeven aan de View
    style={{
      marginHorizontal: Tokens.Space.md,
      marginTop: Tokens.Space.sm,
      padding: Tokens.Space.md,
      borderRadius: 8,
      backgroundColor: `${colors.error}1A`,
    }}
  >
    <Text style={{ color: colors.error, fontSize: 13, fontWeight: '600' }}>
      {message}
    </Text>
  </View>
);

// ─── Main component ─────────────────────────────────────────────
export const CsvUploadContainer: React.FC = () => {
  const master = useMaster();
  const { styles, colors, Tokens } = useAppStyles();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickFile = useCallback(async () => {
    setError(null);
    setIsUploading(true);
    try {
      await executeCsvImport(master);
    } catch (e: unknown) {
      handleImportError(e, setError);
    } finally {
      setIsUploading(false);
    }
  }, [master]);

  return (
    <View style={styles.screenContainer} testID="csv-upload-container">
      <CsvUploadScreen onPickFile={() => { void handlePickFile(); }} isUploading={isUploading} />
      {error !== null && <ErrorBanner message={error} colors={colors} Tokens={Tokens} testID="error-banner" />}
    </View>
  );
};