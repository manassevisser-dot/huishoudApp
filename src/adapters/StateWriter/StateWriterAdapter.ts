import type {
  FormState,
  SetupData,
  Household,
  IncomeItem,
  ExpenseItem,
  DeepPartial
} from '@core/types/core';

import { DATA_KEYS } from '@domain/constants/datakeys';

/**
 * Type voor Redux dispatch acties binnen de applicatie.
 * 
 * @module adapters/state
 * @see {@link ./README.md | StateWriterAdapter - Details}
 * 
 * @param action - UPDATE_DATA actie met partial state update
 */
export type AppDispatch = (action: {
  type: 'UPDATE_DATA';
  payload: DeepPartial<FormState['data']>;
}) => void;

/**
 * Geldige income keys voor dynamische collecties.
 * 
 * @module adapters/state
 * @see {@link ./README.md | StateWriterAdapter - Details}
 */
type KnownIncomeKey =
  | 'nettoSalaris'
  | 'werkFrequentie'
  | 'vakantiegeldPerJaar'
  | 'vakantiegeldPerMaand'
  | `streaming_${string}`;

/**
 * Geldige expense keys voor dynamische collecties.
 * 
 * @module adapters/state
 * @see {@link ./README.md | StateWriterAdapter - Details}
 */
type KnownExpenseKey =
  | 'wegenbelasting'
  | 'ozb'
  | 'energieGas'
  | 'water'
  | `streaming_${string}`;

/**
 * Union type voor read-only of mutable arrays.
 * 
 * @module adapters/state
 * @see {@link ./README.md | StateWriterAdapter - Details}
 * 
 * @typeParam T - Type van items in de array
 */
type ItemsArray<T> = ReadonlyArray<T> | T[];

/**
 * Centraliseert state updates via een consistent writer interface.
 * 
 * @module adapters/state
 * @see {@link ./README.md | StateWriterAdapter - Details}
 * 
 * @remarks
 * - Dispatcht altijd UPDATE_DATA acties naar Redux store
 * - Onderscheidt 4 categorieën: setup, household, latestTransaction, dynamische collecties
 * - Gebruikt overloads voor type-safe field updates
 */
export class StateWriterAdapter {
  /**
   * @param getState - Functie om huidige state op te halen
   * @param dispatch - Redux dispatch functie voor updates
   */
  constructor(
    private readonly getState: () => FormState,
    private readonly dispatch: AppDispatch,
  ) {}

  /**
   * Update een setup field met type-safe waarde.
   * 
   * @param fieldId - Specifiek setup field (bijv. 'aantalMensen')
   * @param value - Nieuwe waarde voor het field
   * 
   * @example
   * writer.updateField('aantalMensen', 4);
   */
  updateField<K extends keyof SetupData>(fieldId: K, value: SetupData[K]): void;

  /**
   * Update een household field met type-safe waarde.
   * 
   * @param fieldId - Specifiek household field (bijv. 'huurtoeslag')
   * @param value - Nieuwe waarde voor het field
   * 
   * @example
   * writer.updateField('huurtoeslag', 150);
   */
  updateField<K extends keyof Household>(fieldId: K, value: Household[K]): void;

  /**
   * Update een known income field (direct of streaming).
   * 
   * @param fieldId - Income field identifier
   * @param value - Numerieke waarde
   */
  updateField(fieldId: KnownIncomeKey, value: number): void;

  /**
   * Update een known expense field (direct of streaming).
   * 
   * @param fieldId - Expense field identifier
   * @param value - Numerieke waarde
   */
  updateField(fieldId: KnownExpenseKey, value: number): void;

  /**
   * Update generiek field via dispatch routing.
   * 
   * @param fieldId - Te updaten field identifier
   * @param value - Nieuwe waarde (type wordt gevalideerd per category)
   * 
   * @remarks
   * Is de router naar juiste writer op volgorde:
   * 1. Setup direct
   * 2. Household direct
   * 3. Latest transaction
   * 4. Dynamische collecties (income/expense)
   */
  updateField(fieldId: string, value: unknown): void {
    if (this.writeSetupDirect(fieldId, value)) return;
    if (this.writeHouseholdDirect(fieldId, value)) return;
    if (this.writeLatestTransaction(fieldId, value)) return;
    if (this.writeDynamicCollections(fieldId, value)) return;

  }

  /**
   * Controleert of fieldId direct naar setup hoort.
   * 
   * @param fieldId - Te controleren identifier
   * @returns `true` als field in setup thuishoort
   * 
   * @internal
   */
  private isDirectSetupField(fieldId: string): boolean {
    const known = new Set<string>([
      'aantalMensen',
      'aantalVolwassen',
      'autoCount',
      'heeftHuisdieren',
      'woningType',
      'postcode',
      'car_repeater',
      'kinderenLabel',
    ]);
    if (known.has(fieldId)) return true;

    const setup = this.getState().data[DATA_KEYS.SETUP];
    return setup !== undefined && setup !== null
      ? Object.prototype.hasOwnProperty.call(setup, fieldId)
      : false;
  }

  /**
   * Controleert of fieldId direct naar household hoort.
   * 
   * @param fieldId - Te controleren identifier
   * @returns `true` als field in household thuishoort
   * 
   * @internal
   */
  private isDirectHouseholdField(fieldId: string): boolean {
    const known = new Set<string>(['huurtoeslag', 'zorgtoeslag']);
    if (known.has(fieldId)) return true;

    const household = this.getState().data[DATA_KEYS.HOUSEHOLD];
    return household !== undefined && household !== null
      ? Object.prototype.hasOwnProperty.call(household, fieldId)
      : false;
  }

  /**
   * Schrijft waarde direct naar setup object.
   * 
   * @param fieldId - Setup field identifier
   * @param value - Nieuwe waarde
   * @returns `true` als update is uitgevoerd
   * 
   * @internal
   */
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

  /**
   * Schrijft waarde direct naar household object.
   * 
   * @param fieldId - Household field identifier
   * @param value - Nieuwe waarde
   * @returns `true` als update is uitgevoerd
   * 
   * @internal
   */
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

  /**
   * Schrijft waarde naar latestTransaction object.
   * 
   * @param fieldId - Latest transaction field (bijv. 'latestTransactionDate')
   * @param value - Nieuwe waarde
   * @returns `true` als update is uitgevoerd
   * 
   * @internal
   */
  private writeLatestTransaction(fieldId: string, value: unknown): boolean {
    const latestTransactionKeys = new Set([
      'latestTransactionDate',
      'latestTransactionAmount',
      'latestTransactionCategory',
      'latestTransactionDescription',
      'latestPaymentMethod',
    ]);

    if (!latestTransactionKeys.has(fieldId)) return false;

    const state = this.getState();
    const latestTransaction = state.data.latestTransaction ?? {};

    this.dispatch({
      type: 'UPDATE_DATA',
      payload: {
        latestTransaction: {
          ...latestTransaction,
          [fieldId]: value,
        },
      },
    });
    return true;
  }

  /**
   * Configuratie voor dynamische collecties (income/expense items).
   * 
   * @internal
   */
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
   * Schrijft waarde naar dynamische collectie (income/expense items).
   * 
   * @param fieldId - Item field identifier
   * @param value - Nieuwe waarde (wordt gedwongen naar number)
   * @returns `true` als update is uitgevoerd
   * 
   * @remarks
   * - Update bestaand item als fieldId al voorkomt in collectie
   * - Voegt nieuw item toe als fieldId accepted is maar nog niet bestaat
   * 
   * @internal
   */
  private writeDynamicCollections(fieldId: string, value: unknown): boolean {
    const state = this.getState();

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

  /**
   * Converteert onbekende waarde naar geldig number.
   * 
   * @param x - Invoerwaarde
   * @returns Geldig number (0 bij invalid input)
   * 
   * @internal
   */
  private coerceNumber(x: unknown): number {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
  }

  /**
   * Valideert of string een bekende income key is.
   * 
   * @param raw - Te valideren string
   * @returns `true` voor vaste keys of streaming_ prefix
   * 
   * @internal
   */
  private isKnownIncomeKey(raw: string): boolean {
    const KNOWN: ReadonlySet<string> = new Set([
      'nettoSalaris',
      'werkFrequentie',
      'vakantiegeldPerJaar',
      'vakantiegeldPerMaand',
    ]);
    return KNOWN.has(raw) || raw.startsWith('streaming_');
  }

  /**
   * Valideert of string een bekende expense key is.
   * 
   * @param raw - Te valideren string
   * @returns `true` voor vaste keys of streaming_ prefix
   * 
   * @internal
   */
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