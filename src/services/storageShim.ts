// src/services/storageShim.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter'; // Aangenomen pad
import type { FormState } from '@core/types/core';

const KEY = '@CashflowWizardState';
const CURRENT_SCHEMA_VERSION = '1.0';
const ENVELOPE_VERSION = 2;

/**
 * Laadt de Phoenix state vanuit AsyncStorage.
 */
async function loadState(): Promise<FormState | null> {
  try {
    const rawData = await AsyncStorage.getItem(KEY);
    if (rawData === null) {
      return null;
    }

    const envelope = JSON.parse(rawData) as { version: number; state: FormState };
    
    // FIX: Expliciete versie-check voorkomt linter 'always true' error
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
 * Slaat de Phoenix state op in de correcte envelope structuur.
 */
async function saveState(state: FormState): Promise<void> {
  try {
    const candidate: FormState = { 
      ...state, 
      schemaVersion: CURRENT_SCHEMA_VERSION 
    };

    const envelope = { 
      version: ENVELOPE_VERSION, 
      state: candidate 
    };

    await AsyncStorage.setItem(KEY, JSON.stringify(envelope));
  } catch (error) {
    AuditLogger.error('STORAGE_SAVE_FAILURE', { error });
  }
}

/**
 * Wis de app-specifieke opslag.
 */
async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    AuditLogger.error('STORAGE_CLEAR_FAILURE', { error });
  }
}

export const StorageShim = {
  loadState,
  saveState,
  clearAll,
};

export default StorageShim;