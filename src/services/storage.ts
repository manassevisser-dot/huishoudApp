import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormStateSchema, type FormStateV1 } from '../state/schemas/FormStateSchema';
import { parseToCents } from '../utils/numbers';

const STORAGE_KEY = '@CashflowWizardState';
export const SCHEMA_VERSION = 2 as const;

/**
 * ADR-15/16: Normaliseert bedragen naar centen-integers.
 * Regel: Integers zijn ALTIJD centen. Alleen floats worden gezien als euro's.
 */
function toCents(val: any): number {
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) return 0;
    // Phoenix-regel: Een float (12.5) is legacy euro's -> naar centen.
    // Een integer (50) is al een Phoenix-minor-unit (50 cent).
    if (!Number.isInteger(val)) return Math.round(Math.abs(val) * 100);
    return Math.abs(val);
  }
  if (typeof val === 'string') return parseToCents(val);
  return 0;
}

/**
 * Migreert legacy data (v0/v1) naar Phoenix v1.0 (centen + schemaVersion)
 */
const migrateToPhoenix = (oldState: any): any => {
  const next = { ...oldState, schemaVersion: '1.0' };

  const migrateList = (obj: any) => {
    const rawList = Array.isArray(obj?.items)
      ? obj.items
      : Array.isArray(obj?.list)
        ? obj.list
        : [];
    return {
      items: rawList.map((it: any, index: number) => ({
        // Stabiele ID generatie ter voorkoming van analytics-breaks
        id: String(it?.id ?? `migrated-${Date.now()}-${index}`),
        amount: toCents(it?.amount ?? it?.value ?? 0),
      })),
    };
  };

  if (next.C7) next.C7 = migrateList(next.C7);
  if (next.C10) next.C10 = migrateList(next.C10);

  return next;
};

export const Storage = {
  async saveState(state: any): Promise<void> {
    try {
      const validated = FormStateSchema.parse({ ...state, schemaVersion: '1.0' });
      const envelope = { version: SCHEMA_VERSION, state: validated };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch (e) {
      console.error('❌ Phoenix Save Blocked: Data corruptie voorkomen', e);
    }
  },

  async loadState(): Promise<FormStateV1 | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const envelope = JSON.parse(raw);
      let data = envelope.version ? envelope.state : envelope;

      if (!envelope.version || envelope.version < SCHEMA_VERSION) {
        data = migrateToPhoenix(data);
        await this.saveState(data); // Direct normaliseren
      }

      return FormStateSchema.parse(data);
    } catch (e) {
      console.error('❌ Phoenix Load/Migration Failed', e);
      return null;
    }
  },
};
