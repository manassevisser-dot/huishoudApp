// src/services/storageShim.ts
/**
 * @file_intent Shim/Adapter voor AsyncStorage. Biedt een gestructureerde interface voor het opslaan en laden van de `FormState` en het thema.
 * @repo_architecture Infrastructure Layer - Storage Adapter.
 * @term_definition Envelope = Een wrapper-object dat de state bevat, samen met metadata zoals een versienummer, om migraties te beheren. Shim = Een dunne laag code die een API aanpast of vereenvoudigt.
 * @contract Functies `loadState` en `saveState` gebruiken een envelope om de `FormState` te versioneren. `loadTheme` en `saveTheme` behandelen de thema-string. Alle functies vangen fouten af en loggen deze via `AuditLogger`.
 * @ai_instruction Dit is de enige interface naar AsyncStorage. Bij een brekende wijziging in `FormState`, verhoog `ENVELOPE_VERSION` om te voorkomen dat ongeldige data wordt geladen.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter';
import type { FormState } from '@core/types/core';
import type { Theme } from '@domain/constants/Colors'; // De enige bron van waarheid

const KEY = '@CashflowWizardState';
const THEME_KEY = '@Theme';
const CURRENT_SCHEMA_VERSION = '1.0';
const ENVELOPE_VERSION = 2;

/**
 * Laadt de Phoenix state vanuit AsyncStorage.
 */
async function loadState(): Promise<FormState | null> {
  try {
    const rawData = await AsyncStorage.getItem(KEY);
    if (rawData === null) return null;

    const envelope = JSON.parse(rawData) as { version: number; state: FormState };
    if (envelope.version === ENVELOPE_VERSION) {
      return envelope.state;
    }
    return null;
  } catch (error) {
    AuditLogger.error('STORAGE_LOAD_FAILURE', { error });
    return null;
  }
}

/**
 * Slaat de Phoenix state op.
 */
async function saveState(state: FormState): Promise<void> {
  try {
    const candidate: FormState = { ...state, schemaVersion: CURRENT_SCHEMA_VERSION };
    const envelope = { version: ENVELOPE_VERSION, state: candidate };
    await AsyncStorage.setItem(KEY, JSON.stringify(envelope));
  } catch (error) {
    AuditLogger.error('STORAGE_SAVE_FAILURE', { error });
  }
}

/**
 * Thema laden (infra).
 */
export async function loadTheme(): Promise<Theme | null> {
  try {
    const saved = await AsyncStorage.getItem(THEME_KEY);
    return (saved === 'light' || saved === 'dark') ? (saved as Theme) : null;
  } catch (error) {
    AuditLogger.error('THEME_LOAD_FAILURE', { error });
    return null;
  }
}

/**
 * Thema opslaan (infra).
 */
export async function saveTheme(theme: Theme): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    AuditLogger.error('THEME_SAVE_FAILURE', { error });
  }
}

export const StorageShim = {
  loadState,
  saveState,
  loadTheme,
  saveTheme,
  clearAll: async () => {
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (error) {
      AuditLogger.error('STORAGE_CLEAR_FAILURE', { error });
    }
  }
};

export default StorageShim;