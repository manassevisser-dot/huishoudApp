// CU-001-SHIM — Storage API shim (Phoenix v1.0)
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LegacyNamespace from '@adapters/storage/storage';
import type { FormState } from '@shared-types/form';

const KEY = '@CashflowWizardState';

/**
 * Losse functies definiëren zorgt ervoor dat Jest de properties 
 * op het geëxporteerde object kan overschrijven (mocken).
 */

async function loadState(): Promise<FormState | null> {
  const L = (LegacyNamespace as any).Storage || LegacyNamespace;

  // Phoenix-integriteit: Delegeer ALTIJD naar de migratie-engine van legacy.
  if (typeof L.loadState === 'function') {
    return await L.loadState();
  }

  return null; // Geen legacy? Dan start de app 'schoon' via de orchestrator.
}

async function saveState(state: FormState): Promise<void> {
  const L = (LegacyNamespace as any).Storage || LegacyNamespace;
  // Forceer Phoenix Contract
  const candidate = { ...state, schemaVersion: '1.0' };

  if (typeof L.saveState === 'function') {
    return await L.saveState(candidate);
  }

  // Fallback: Gebruik de correcte Phoenix-envelope (version 2)
  const envelope = { version: 2, state: candidate };
  await AsyncStorage.setItem(KEY, JSON.stringify(envelope));
}

async function clearAll(): Promise<void> {
  const L = (LegacyNamespace as any).Storage || LegacyNamespace;

  if (typeof L.clearAll === 'function') {
    return await L.clearAll();
  }

  // Phoenix-safe: Wis alleen de app-specifieke key, niet het hele device.
  await AsyncStorage.removeItem(KEY);
}

// Export als een veranderbaar object voor Jest support
export const StorageShim = {
  loadState,
  saveState,
  clearAll,
};

export default StorageShim;