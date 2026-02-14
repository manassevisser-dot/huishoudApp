import type {
  FormState,
  SetupData,
  Household,
  IncomeItem,
  ExpenseItem,
} from '@core/types/core';

import { DATA_KEYS } from '@domain/constants/datakeys';

export type AppDispatch = (action: {
  type: 'UPDATE_DATA';
  payload: Partial<FormState['data']>;
}) => void;

// ── Typed field-ID unions voor dynamische collecties ───────────

type KnownIncomeKey =
  | 'nettoSalaris'
  | 'werkFrequentie'
  | 'vakantiegeldPerJaar'
  | 'vakantiegeldPerMaand'
  | `streaming_${string}`;

type KnownExpenseKey =
  | 'wegenbelasting'
  | 'ozb'
  | 'energieGas'
  | 'water'
  | `streaming_${string}`;

// ── Collection helper type ─────────────────────────────────────

type ItemsArray<T> = ReadonlyArray<T> | T[];

/**
 * StateWriterAdapter
 * - Eén plek voor "waar gaat dit veld heen?" én "maak aan bij eerste keer".
 * - Werkt met VOLLEDIG lege startsituatie (alle lades leeg).
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
    private readonly dispatch: AppDispatch,
  ) {}

  // ── Publieke API (overloads voor type-safety) ────────────────

  updateField<K extends keyof SetupData>(fieldId: K, value: SetupData[K]): void;
  updateField<K extends keyof Household>(fieldId: K, value: Household[K]): void;
  updateField(fieldId: KnownIncomeKey, value: number): void;
  updateField(fieldId: KnownExpenseKey, value: number): void;
  updateField(fieldId: string, value: unknown): void {
    if (this.writeSetupDirect(fieldId, value)) return;
    if (this.writeHouseholdDirect(fieldId, value)) return;
    if (this.writeDynamicCollections(fieldId, value)) return;
    // Onbekend / niet te routeren → fail-closed
  }

  // ── Directe velden ───────────────────────────────────────────

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
    const setup = state.data[DATA_KEYS.SETUP];
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
    const household = state.data[DATA_KEYS.HOUSEHOLD];
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

  // ── Dynamische collecties ────────────────────────────────────

  private readonly COLLECTIONS = [
    {
      key: 'FINANCE_INCOME' as const,
      get: (s: FormState): ItemsArray<IncomeItem> =>
        s.data[DATA_KEYS.FINANCE]?.income?.items ?? [],
      buildPatch: (s: FormState, items: IncomeItem[]) => ({
        [DATA_KEYS.FINANCE]: {
          ...s.data[DATA_KEYS.FINANCE],
          income: {
            ...s.data[DATA_KEYS.FINANCE]?.income,
            items,
          },
        },
      }),
      accepts: (fieldId: string) => this.isKnownIncomeKey(fieldId),
      toItem: (fieldId: string, value: unknown): IncomeItem => ({
        fieldId,
        amount: this.coerceNumber(value),
      }),
    },
    {
      key: 'FINANCE_EXPENSES' as const,
      get: (s: FormState): ItemsArray<ExpenseItem> =>
        s.data[DATA_KEYS.FINANCE]?.expenses?.items ?? [],
      buildPatch: (s: FormState, items: ExpenseItem[]) => ({
        [DATA_KEYS.FINANCE]: {
          ...s.data[DATA_KEYS.FINANCE],
          expenses: {
            ...s.data[DATA_KEYS.FINANCE]?.expenses,
            items,
          },
        },
      }),
      accepts: (fieldId: string) => this.isKnownExpenseKey(fieldId),
      toItem: (fieldId: string, value: unknown): ExpenseItem => ({
        fieldId,
        amount: this.coerceNumber(value),
      }),
    },
  ];

  /**
   * Zoek & upsert over ALLE geregistreerde collecties.
   * Returnt true als er iets is gewijzigd.
   */
  private writeDynamicCollections(fieldId: string, value: unknown): boolean {
    const state = this.getState();

    // 1) Update bestaande
    for (const col of this.COLLECTIONS) {
      const items = col.get(state);
      const idx = (items as ReadonlyArray<{ fieldId: string }>).findIndex(
        (i) => i.fieldId === fieldId,
      );
      if (idx !== -1) {
        const next = [...items] as { fieldId: string }[];
        next[idx] = { ...next[idx], ...col.toItem(fieldId, value) };
        this.dispatch({
          type: 'UPDATE_DATA',
          payload: col.buildPatch(state, next as IncomeItem[] & ExpenseItem[]),
        });
        return true;
      }
    }

    // 2) Create nieuwe — expliciet undefined-check (strict-boolean-expressions)
    const target = this.COLLECTIONS.find((c) => c.accepts(fieldId));
    if (target === undefined) return false;

    const current = target.get(state);
    const born = [...(current as { fieldId: string }[]), target.toItem(fieldId, value)];
    this.dispatch({
      type: 'UPDATE_DATA',
      payload: target.buildPatch(state, born as IncomeItem[] & ExpenseItem[]),
    });
    return true;
  }

  // ── Helpers ──────────────────────────────────────────────────

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
    const KNOWN: ReadonlySet<string> = new Set([
      'wegenbelasting',
      'ozb',
      'energieGas',
      'water',
    ]);
    return KNOWN.has(raw) || raw.startsWith('streaming_');
  }
}
