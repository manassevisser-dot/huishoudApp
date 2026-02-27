// src/adapters/system/PersistenceAdapter.ts
/**
 * @file_intent Beheert het opslaan en laden van applicatie-state naar AsyncStorage.
 * @repo_architecture Mobile Industry (MI) - Infrastructure Adapter Layer.
 * @term_definition
 *   PersistableFormState = Strikte subset van FormState die veilig op schijf mag staan.
 *   STORAGE_KEY = De enige opslagsleutel. Versienummer zit in de key zelf voor toekomstige migraties.
 * @contract
 *   save(state) → serialiseert en slaat op. Nooit throwend naar buiten.
 *   load()      → deserialiseert en valideert. Bij fout: null + key verwijderd.
 *   clear()     → verwijdert de key volledig.
 * @ai_instruction
 *   PersistenceAdapter kent GEEN BusinessManager, GEEN reducer, GEEN orchestrators.
 *   viewModels worden nooit opgeslagen — ze zijn derived en worden herberekend bij hydration.
 *   activeStep en currentScreenId worden niet opgeslagen — navigatiepositie reset altijd naar LANDING.
 *   Migratie-haakpunt: controleer schemaVersion bij load(). Mismatch → null teruggeven.
 *   Om later van AsyncStorage naar MMKV te migreren: vervang alleen de AsyncStorage-calls.
 *   Het contract (save/load/clear) blijft ongewijzigd voor de rest van de codebase.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FormState } from '@core/types/core';
import { logger } from '@adapters/audit/AuditLoggerAdapter';

// ─── Storage key ────────────────────────────────────────────────────────────
// Versienummer in de key → bij schema-breuk is de oude key automatisch onleesbaar
// en valt de app terug op initialFormState zonder crash.
const STORAGE_KEY = 'APP_FORM_STATE_V1' as const;

// ─── PersistableFormState ─────────────────────────────────────────────────────
// Expliciete subset van FormState. Alles wat hier NIET in staat wordt ook NIET opgeslagen.
// viewModels: nooit — berekend, vluchtig.
// activeStep / currentScreenId: nooit — navigatie reset altijd naar LANDING.
// isValid: nooit — wordt herberekend na hydration.
type PersistableFormState = {
  schemaVersion: '1.0';
  data: {
    setup: FormState['data']['setup'];
    household: FormState['data']['household'];
    finance: FormState['data']['finance'];
    latestTransaction?: FormState['data']['latestTransaction'];
    // csvImport wordt toegevoegd in Fase 5 (nog niet in FormState aanwezig)
  };
  meta: FormState['meta'];
};

// ─── Mapper: FormState → PersistableFormState ────────────────────────────────
// Pure functie, geen side effects. Strip alles wat niet opgeslagen mag worden.
function toPersistable(state: FormState): PersistableFormState {
  return {
    schemaVersion: '1.0',
    data: {
      setup: state.data.setup,
      household: state.data.household,
      finance: state.data.finance,
      latestTransaction: state.data.latestTransaction,
    },
    meta: state.meta,
  };
}

// ─── Type guard voor geladen data ─────────────────────────────────────────────
function isPersistableFormState(value: unknown): value is PersistableFormState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v['schemaVersion'] === '1.0' &&
    typeof v['data'] === 'object' && v['data'] !== null &&
    typeof v['meta'] === 'object' && v['meta'] !== null
  );
}

// ─── Publieke API ──────────────────────────────────────────────────────────────

/**
 * Slaat de huidige FormState op in AsyncStorage.
 * Stript alle vluchtige velden via toPersistable().
 * Gooit nooit — fouten worden gelogd en genegeerd.
 */
export async function save(state: FormState): Promise<void> {
  try {
    const persistable = toPersistable(state);
    const json = JSON.stringify(persistable);
    await AsyncStorage.setItem(STORAGE_KEY, json);
    logger.info('state_persisted', {
      adapter: 'persistence',
      action: 'save',
      lastModified: state.meta.lastModified,
    });
  } catch (error) {
    logger.warn('state_persist_failed', {
      adapter: 'persistence',
      action: 'save',
      error: error instanceof Error ? error.message : 'unknown',
    });
  }
}

/**
 * Laadt de opgeslagen state uit AsyncStorage.
 * Bij corrupt JSON, ontbrekende key, of schema-mismatch: verwijder de key en retourneer null.
 * De caller (FormStateProvider) valt dan terug op initialFormState.
 */
// ─── Helper: probeert corrupte storage op te ruimen ─────────────
async function cleanupCorruptStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Niets meer te doen — fallback is al null return
  }
}

// ─── Helper: log corrupte data en ruim op ───────────────────────
async function handleInvalidState(parsed: unknown): Promise<null> {
  logger.warn('storage_corrupt', {
    adapter: 'persistence',
    action: 'load',
    reason: 'schema_mismatch_or_invalid_structure',
    parsed: true,  // JSON.parse() slaagde
    hasExpectedShape: typeof parsed === 'object' && parsed !== null && 'data' in parsed,
  });
  await cleanupCorruptStorage();
  return null;
}

// ─── Main functie ───────────────────────────────────────────────
export async function load(): Promise<PersistableFormState | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json === null) return null;

    const parsed: unknown = JSON.parse(json);
    if (!isPersistableFormState(parsed)) return await handleInvalidState(parsed);

    logger.info('hydration_success', {
      adapter: 'persistence',
      action: 'load',
      lastModified: parsed.meta.lastModified,
    });
    return parsed;
  } catch (error) {
    logger.warn('hydration_failed', {
      adapter: 'persistence',
      action: 'load',
      error: error instanceof Error ? error.message : 'unknown',
    });
    void cleanupCorruptStorage(); // fire-and-forget, return blijft null
    return null;
  }
}

/**
 * Verwijdert de opgeslagen state volledig.
 * Wordt aangeroepen bij RESET_APP.
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    logger.info('storage_cleared', {
      adapter: 'persistence',
      action: 'clear',
    });
  } catch (error) {
    logger.warn('storage_clear_failed', {
      adapter: 'persistence',
      action: 'clear',
      error: error instanceof Error ? error.message : 'unknown',
    });
  }
}
