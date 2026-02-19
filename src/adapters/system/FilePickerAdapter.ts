// src/adapters/system/FilePickerAdapter.ts
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

/**
 * Adapter voor platform-specifieke bestandstoegang.
 * Gebruikt Expo SDK 54 compatibele calls en types.
 */
export async function pickAndReadCsvFile(): Promise<string> {
  const result = await DocumentPicker.getDocumentAsync({
    // Gebruik een array van mime-types voor maximale compatibiliteit
    type: ['text/comma-separated-values', 'text/plain'],
    copyToCacheDirectory: true,
  });

  // Check op annulering (explicit boolean check voor de linter)
  if (result.canceled === true) {
    throw new Error('Bestand selecteren geannuleerd');
  }

  // Valideer of er assets aanwezig zijn
  if (result.assets === null || result.assets === undefined || result.assets.length === 0) {
    throw new Error('Geen bestand geselecteerd');
  }

  const asset = result.assets[0];
  if (asset === null || asset === undefined) {
    throw new Error('Bestandsdata is corrupt of ontbreekt');
  }

  try {
    /**
     * De documentatie geeft aan dat 'utf8' direct als string geaccepteerd wordt.
     * Dit omzeilt de "Property 'EncodingType' does not exist" TS-error.
     */
    return await FileSystem.readAsStringAsync(asset.uri, {
      encoding: 'utf8',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Onbekende fout bij lezen';
    throw new Error(`FilePickerAdapter: ${message}`);
  }
}