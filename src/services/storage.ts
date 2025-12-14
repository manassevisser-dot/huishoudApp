//=====
// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormState } from '../context/FormContext';

const STORAGE_KEY = '@CashflowWizardState';

/**
 * Schema versioning
 * - Verhoog dit nummer wanneer de structuur van FormState verandert
 */
export const SCHEMA_VERSION = 1 as const;

/**
 * Envelope type voor opslag: versie + FormState
 */
interface StoredState {
  version: number;
  state: FormState;
}

/**
 * Migratie placeholder
 * - Nu: pass-through
 * - Later: per versie migreren
 */
const migrateSchema = (storedState: StoredState): FormState => {
  // Voorbeeld voor later:
  // if (storedState.version === 0) { ... }
  // if (storedState.version === 1) { ... }
  return storedState.state;
};

export const Storage = {
  /**
   * Save: sla FormState op als versioned envelope
   */
  async saveState(state: FormState): Promise<void> {
    try {
      const storedState: StoredState = {
        version: SCHEMA_VERSION,
        state,
      };
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storedState)
      );
    } catch (e) {
      console.error('Failed to save state to storage', e);
    }
  },

  /**
   * Load:
   * - herkent legacy (onversioned) data
   * - migreert indien nodig
   * - retourneert altijd FormState of null
   */
  async loadState(): Promise<FormState | null> {
    try {
      const serializedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (serializedState === null) {
        return null;
      }

      const rawData: unknown = JSON.parse(serializedState);

      const isNewFormat =
        typeof rawData === 'object' &&
        rawData !== null &&
        'version' in rawData &&
        'state' in rawData &&
        typeof (rawData as any).version === 'number';

      const storedData: StoredState = isNewFormat
        ? (rawData as StoredState)
        : {
            // Legacy: oude platte FormState → behandel als versie 0
            version: 0,
            state: rawData as FormState,
          };

      // Nieuwere dan ondersteunde versie → as-is (defensief)
      if (storedData.version > SCHEMA_VERSION) {
        console.warn(
          `Stored state version (${storedData.version}) is newer than supported (${SCHEMA_VERSION}). Using stored state as-is.`
        );
        return storedData.state;
      }

      // Legacy (lager dan huidig) → migratie
      if (storedData.version < SCHEMA_VERSION) {
        const migrated = migrateSchema(storedData);

        /**
         * 🔒 COMMENT-GUARD — NORMALISATIE (UIT)
         * ------------------------------------------------
         * Wanneer er echte migraties bestaan (bijv. SCHEMA_VERSION = 2),
         * kan onderstaande block worden geactiveerd zodat:
         * - migratie slechts één keer gebeurt
         * - storage daarna altijd genormaliseerd is
         *
         * Nu UIT om overkill en extra IO te vermijden.
         */
        /*
        try {
          const normalized: StoredState = {
            version: SCHEMA_VERSION,
            state: migrated,
          };
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(normalized)
          );
        } catch (e) {
          console.error('Failed to persist normalized migrated state', e);
        }
        */

        return migrated;
      }

      // Exacte match
      return storedData.state;
    } catch (e) {
      console.error(
        'Failed to load state from storage (or migration failed)',
        e
      );
      return null;
    }
  },

  /**
   * Clear all persisted state
   */
  async clearAllState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear state from storage', e);
    }
  },
};
