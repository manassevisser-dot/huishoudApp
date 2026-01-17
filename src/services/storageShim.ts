// CU-001-SHIM — Storage API shim (Phoenix v1.0)
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LegacyNamespace from '@services/storage';
import type { FormState } from '@shared-types/form';


const KEY = '@CashflowWizardState';

export const StorageShim = {
  async loadState(): Promise<FormState | null> {
    const L = (LegacyNamespace as any).Storage || LegacyNamespace;

    // Phoenix-integriteit: Delegeer ALTIJD naar de migratie-engine van legacy.
    // De shim mag zelf geen raw JSON parsen om dubbele parsing-logica te voorkomen.
    if (typeof L.loadState === 'function') {
      return await L.loadState();
    }

    return null; // Geen legacy? Dan start de app 'schoon' via de orchestrator.
  },

  async saveState(state: FormState): Promise<void> {
    const L = (LegacyNamespace as any).Storage || LegacyNamespace;
    // Forceer Phoenix Contract
    const candidate = { ...state, schemaVersion: '1.0' };

    if (typeof L.saveState === 'function') {
      return await L.saveState(candidate);
    }

    // Fallback: Gebruik de correcte Phoenix-envelope (version 2)
    const envelope = { version: 2, state: candidate };
    await AsyncStorage.setItem(KEY, JSON.stringify(envelope));
  },

  async clearAll(): Promise<void> {
    const L = (LegacyNamespace as any).Storage || LegacyNamespace;

    if (typeof L.clearAll === 'function') {
      return await L.clearAll();
    }

    // Phoenix-safe: Wis alleen de app-specifieke key, niet het hele device.
    await AsyncStorage.removeItem(KEY);
  },
};

export default StorageShim;
