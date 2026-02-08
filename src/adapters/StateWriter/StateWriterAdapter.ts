import type { FormState } from '@core/types/core';
import { DATA_KEYS } from '@domain/constants/datakeys';

export type AppDispatch = (action: {
  type: 'UPDATE_DATA';
  payload: Partial<FormState['data']>;
}) => void;

// Sterke item-typers (halen we uit jouw eigen FormState)
type FinanceIncomeItem = FormState['data']['finance']['income']['items'][number];
type FinanceExpenseItem = FormState['data']['finance']['expenses']['items'][number];

type ItemsArray<T> = ReadonlyArray<T> | T[];

/**
 * StateWriterAdapter
 * - Eén plek voor "waar gaat dit veld heen?" én "maak aan bij eerste keer".
 * - Werkt met VOLLEDIG lege startsituatie (alle lades leeg).
 * - Geen field-to-section map nodig; gebruikt kleine collectie-registratie.
 *
 * Flow:
 *   updateField(fieldId, value)
 *    → direct field? patch direct
 *    → anders: zoek in dynamische collecties (upsert: create/update)
 *    → dispatch({ type:'UPDATE_DATA', payload: patch })
 */
export class StateWriterAdapter {
  constructor(
    private readonly getState: () => FormState,
    private readonly dispatch: AppDispatch
  ) {}

  /**
   * Publieke API voor alle writes vanuit de Orchestrator.
   * fieldId = logisch veld; value = reeds gevalideerd/genormaliseerd aan de boundary.
   *
   * Opgeknipt zodat we onder de ESLint-limiet blijven.
   */
  updateField(fieldId: string, value: unknown): void {
    if (this.writeSetupDirect(fieldId, value)) return;
    if (this.writeHouseholdDirect(fieldId, value)) return;
    if (this.writeDynamicCollections(fieldId, value)) return;
    // Onbekend / niet te routeren → fail-closed
  }

  // ───────────────────────────────────────── Directe velden ─────────────────

  private isDirectSetupField(fieldId: string): boolean {
    const known = new Set<string>([
      'aantalMensen',
      'aantalVolwassen',
      'autoCount',
      'heeftHuisdieren',
      'woningType',
      'car_repeater',
      'kinderenLabel',
    ]);
    if (known.has(fieldId)) return true;

    const setup = this.getState().data[DATA_KEYS.SETUP];
    return setup !== undefined && setup !== null
      ? Object.prototype.hasOwnProperty.call(setup, fieldId)
      : false;
  }

  private isDirectHouseholdField(fieldId: string): boolean {
    const known = new Set<string>(['huurtoeslag', 'zorgtoeslag']);
    if (known.has(fieldId)) return true;

    const household = this.getState().data[DATA_KEYS.HOUSEHOLD];
    return household !== undefined && household !== null
      ? Object.prototype.hasOwnProperty.call(household, fieldId)
      : false;
  }

  private writeSetupDirect(fieldId: string, value: unknown): boolean {
    if (!this.isDirectSetupField(fieldId)) return false;

    const state = this.getState();
    const setup = state.data[DATA_KEYS.SETUP] ?? {};
    this.dispatch({
      type: 'UPDATE_DATA',
      payload: {
        [DATA_KEYS.SETUP]: {
          ...setup,
          [fieldId]: value,
        } as typeof setup,
      },
    });
    return true;
  }

  private writeHouseholdDirect(fieldId: string, value: unknown): boolean {
    if (!this.isDirectHouseholdField(fieldId)) return false;

    const state = this.getState();
    const household = state.data[DATA_KEYS.HOUSEHOLD] ?? {};
    this.dispatch({
      type: 'UPDATE_DATA',
      payload: {
        [DATA_KEYS.HOUSEHOLD]: {
          ...household,
          [fieldId]: value,
        } as typeof household,
      },
    });
    return true;
  }

  // ─────────────── Dynamische collecties (generieke upsert over items[]) ────

  private readonly COLLECTIONS = [
    {
      key: 'FINANCE_INCOME' as const,
      get: (s: FormState): ItemsArray<FinanceIncomeItem> =>
        s.data[DATA_KEYS.FINANCE]?.income?.items ?? [],
      buildPatch: (s: FormState, items: ItemsArray<FinanceIncomeItem>) => ({
        [DATA_KEYS.FINANCE]: {
          ...s.data[DATA_KEYS.FINANCE],
          income: {
            ...s.data[DATA_KEYS.FINANCE]?.income,
            items: items as FormState['data'][typeof DATA_KEYS.FINANCE]['income']['items'],
          },
        },
      }),
      accepts: (fieldId: string) => this.isKnownIncomeKey(fieldId),
      toItem: (fieldId: string, value: unknown): FinanceIncomeItem => ({
        fieldId,
        amount: this.coerceNumber(value),
      }),
    },
    {
      key: 'FINANCE_EXPENSES' as const,
      get: (s: FormState): ItemsArray<FinanceExpenseItem> =>
        s.data[DATA_KEYS.FINANCE]?.expenses?.items ?? [],
      buildPatch: (s: FormState, items: ItemsArray<FinanceExpenseItem>) => ({
        [DATA_KEYS.FINANCE]: {
          ...s.data[DATA_KEYS.FINANCE],
          expenses: {
            ...s.data[DATA_KEYS.FINANCE]?.expenses,
            items: items as FormState['data'][typeof DATA_KEYS.FINANCE]['expenses']['items'],
          },
        },
      }),
      accepts: (fieldId: string) => this.isKnownExpenseKey(fieldId),
      toItem: (fieldId: string, value: unknown): FinanceExpenseItem => ({
        fieldId,
        amount: this.coerceNumber(value),
      }),
    },
  ] as const;

  /**
   * Zoek & upsert over ALLE geregistreerde collecties:
   * - Als fieldId ergens bestaat → update dáár.
   * - Anders kies de EERSTE collectie waarvan `accepts(fieldId)` true geeft → create.
   *
   * Returnt true als er iets is gewijzigd (en dus gepatcht).
   */
  private writeDynamicCollections(fieldId: string, value: unknown): boolean {
    const state = this.getState();

    // 1) Bestaande match? → update
    for (const col of this.COLLECTIONS) {
      const items = col.get(state);
      const idx = (items as ReadonlyArray<{ fieldId: string }>).findIndex(
        (i) => i.fieldId === fieldId
      );
      if (idx !== -1) {
        const next = items.slice() as { fieldId: string }[];
        const updated = { ...next[idx], ...col.toItem(fieldId, value) };
        next[idx] = updated;
        this.dispatch({ type: 'UPDATE_DATA', payload: col.buildPatch(state, next) });
        return true;
      }
    }

    // 2) Geen match → kies collectie via accepts(...) → geboorte
    const target = this.COLLECTIONS.find((c) => c.accepts(fieldId));
    if (target === undefined) return false;

    const current = target.get(state);
    const born = [...(current as { fieldId: string }[]), target.toItem(fieldId, value)];
    this.dispatch({ type: 'UPDATE_DATA', payload: target.buildPatch(state, born) });
    return true;
  }

  // ─────────────────────────────── Helpers ────────────────────────────────

  private coerceNumber(x: unknown): number {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
  }

  private isKnownIncomeKey(raw: string): boolean {
    const KNOWN: ReadonlySet<string> = new Set([
      'nettoSalaris',
      'werkFrequentie',
      'vakantiegeldPerJaar',
      'vakantiegeldPerMaand',
    ]);
    return KNOWN.has(raw) || raw.startsWith('streaming_');
  }

  private isKnownExpenseKey(raw: string): boolean {
    const KNOWN: ReadonlySet<string> = new Set(['wegenbelasting', 'ozb', 'energieGas', 'water']);
    return KNOWN.has(raw) || raw.startsWith('streaming_');
  }
}