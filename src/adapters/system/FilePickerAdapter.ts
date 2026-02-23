// src/adapters/system/FilePickerAdapter.ts
/**
 * @file_intent Faciliteert de interactie met het besturingssysteem voor het selecteren en inlezen van lokale bestanden.
 * @repo_architecture Mobile Industry (MI) - Infrastructure Adapter Layer.
 * @term_definition
 *   DocumentPicker = Expo module voor OS-native file selectie.
 *   FileSystem     = Module voor het uitlezen van bestandsinhoud naar geheugen.
 *   CsvFileResult  = Het verrijkte resultaat: tekst + bestandsnaam + gedetecteerde bank.
 * @contract
 *   Stateless bridge naar device-capabilities.
 *   Retourneert { text, fileName, detectedBank? } of gooit een expliciete Error
 *   bij annulering of corruptie.
 *   Bank-detectie is een best-effort hint — undefined is altijd een geldig resultaat.
 * @ai_instruction
 *   Maakt gebruik van Expo SDK 54 API's.
 *   Bank-detectie-logica zit in BankFormatDetector.ts (testbaar, los van I/O).
 *   CsvUploadContainer gebruikt detectedBank als hint voor ImportOrchestrator.
 *   Om later MMKV of andere storage te gebruiken: alleen PersistenceAdapter.ts aanpassen.
 * @changes [Fase 3] Return type uitgebreid van Promise<string> naar Promise<CsvFileResult>.
 *   BankFormatDetector aangekoppeld voor automatische bank-herkenning.
 *   fileName toegevoegd aan resultaat voor opslag in CsvImportStateSlice.
 */
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import type { DutchBank } from '@app/orchestrators/types/csvUpload.types';
import { detectBankFromCsv } from '@domain/finance/BankFormatDetector';

// ─── Resultaat type ────────────────────────────────────────────────────────────

/**
 * Het volledige resultaat van een bestandsselectie + lees-operatie.
 */
export interface CsvFileResult {
  /** Volledige CSV-tekst in UTF-8 */
  text: string;

  /** Originele bestandsnaam inclusief extensie (bijv. 'transacties_2025.csv') */
  fileName: string;

  /**
   * Automatisch gedetecteerde bank op basis van kolomnamen in de header.
   * undefined als de bank niet herkend werd.
   */
  detectedBank: DutchBank;
}

// ─── Publieke API ──────────────────────────────────────────────────────────────

/**
 * Opent de OS-native file picker, leest het geselecteerde CSV-bestand,
 * en detecteert automatisch de bank op basis van de headerregel.
 *
 * @throws Error met Nederlandse melding bij annulering of bestandsfouten.
 * @returns CsvFileResult met tekst, bestandsnaam en optionele bank-hint.
 */
export async function pickAndReadCsvFile(): Promise<CsvFileResult> {
  const result = await DocumentPicker.getDocumentAsync({
    // Array van mime-types voor maximale compatibiliteit (bank-afhankelijk)
    type: ['text/comma-separated-values', 'text/plain'],
    copyToCacheDirectory: true,
  });

  if (result.canceled === true) {
    throw new Error('Bestand selecteren geannuleerd');
  }

  if (result.assets === null || result.assets === undefined || result.assets.length === 0) {
    throw new Error('Geen bestand geselecteerd');
  }

  const asset = result.assets[0];
  if (asset === null || asset === undefined) {
    throw new Error('Bestandsdata is corrupt of ontbreekt');
  }

  let text: string;
  try {
    /**
     * 'utf8' als string literal omzeilt de "Property 'EncodingType' does not exist" TS-fout
     * die optreedt bij gebruik van FileSystem.EncodingType.UTF8 in sommige Expo-versies.
     */
    text = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: 'utf8',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Onbekende fout bij lezen';
    throw new Error(`FilePickerAdapter: ${message}`);
  }

  // Bestandsnaam: gebruik asset.name indien beschikbaar, anders extraheer uit URI
  const fileName = resolveFileName(asset);

  // Bank-detectie: pure functie in domein-laag, testbaar los van I/O
  const detectedBank = detectBankFromCsv(text);

  return { text, fileName, detectedBank };
}

// ─── Private helpers ───────────────────────────────────────────────────────────

/**
 * Extraheert de bestandsnaam uit de asset.
 * Expo SDK 54 levert 'name' op het asset-object.
 * Fallback naar URI-segment als name ontbreekt.
 */
function resolveFileName(asset: { name?: string; uri: string }): string {
  if (typeof asset.name === 'string' && asset.name.trim().length > 0) {
    return asset.name.trim();
  }

  // Fallback: laatste segment van de URI
  const segments = asset.uri.split('/');
  const last = segments[segments.length - 1];
  return typeof last === 'string' && last.length > 0 ? last : 'onbekend.csv';
}
