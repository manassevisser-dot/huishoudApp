
// src/test-utils/mocks.ts
import { FormState } from '@shared-types/form';

// ——— Types (houd het bij wat je project nu gebruikt) ———
export type Frequency = 'week' | '4wk' | 'month' | 'quarter' | 'year';

export interface AmountItem {
  id: string;
  amountCents: number;
  frequency?: Frequency | string;
}

export interface Member {
  entityId: string;
  fieldId: string;
  memberType: 'adult' | 'child';
  naam?: string;
  gender?: string;
  dateOfBirth?: string; // ISO YYYY-MM-DD
  leeftijd?: number;
}

export interface FinanceState {
  income: { items: AmountItem[] };
  expenses: { items: AmountItem[] };
}

// ——— Mini PRNG voor deterministische data (optioneel) ———
let _seed = 42;
export function setMockSeed(seed: number) { _seed = seed; }
function rnd() {
  // LCG: deterministisch, simpel voor tests
  _seed = (1103515245 * _seed + 12345) % 2 ** 31;
  return _seed / 2 ** 31;
}
function pick<T>(arr: T[]): T {
  return arr[Math.max(0, Math.min(arr.length - 1, Math.floor(rnd() * arr.length)))];
}

// ——— Member factories ———
export function makeMember(index = 1, type: 'adult' | 'child' = 'adult', overrides?: Partial<Member>): Member {
  const id = `${type}-${index}`;
  return {
    entityId: overrides?.entityId ?? id,
    fieldId: overrides?.fieldId ?? `member-${id}`,
    memberType: overrides?.memberType ?? type,
    naam: overrides?.naam ?? `${type} ${index}`,
    gender: overrides?.gender,
    dateOfBirth: overrides?.dateOfBirth,
    leeftijd: overrides?.leeftijd,
  };
}

export function makeMembers(count: number, type: 'adult' | 'child' = 'adult', startIndex = 1): Member[] {
  return Array.from({ length: count }, (_, i) => makeMember(startIndex + i, type));
}

export function makeMixedHousehold(adults = 2, children = 0): Member[] {
  return [...makeMembers(adults, 'adult'), ...makeMembers(children, 'child')];
}

// ——— Finance item factories ———
export function makeIncomeItem(index = 1, cents = 10000, frequency: Frequency = 'month'): AmountItem {
  return { id: `inc-${index}`, amountCents: cents, frequency };
}

export function makeExpenseItem(index = 1, cents = 5000, frequency: Frequency = 'month'): AmountItem {
  return { id: `exp-${index}`, amountCents: cents, frequency };
}

export function makeFinance(
  income: AmountItem[] = [makeIncomeItem(1, 10000, 'month')],
  expenses: AmountItem[] = [makeExpenseItem(1, 5000, 'month')]
): FinanceState {
  return { income: { items: income }, expenses: { items: expenses } };
}

// ——— Complete FormState fixtures ———
export function makePhoenixStateWithHousehold(
  { adults = 2, children = 0, activeStep = 'WIZARD', currentPageId = 'setupHousehold' }: {
    adults?: number; children?: number; activeStep?: 'LANDING' | 'WIZARD' | 'DASHBOARD'; currentPageId?: string;
  },
  finance?: FinanceState
): FormState {
  return {
    activeStep,
    currentPageId,
    isValid: false,
    data: {
      setup: { aantalMensen: adults + children, aantalVolwassen: adults },
      household: { members: makeMixedHousehold(adults, children) },
      finance: finance ?? makeFinance(),
    },
  };
}

// ——— Convenience: “rijk” scenario’s ———
export function makeWeeklyIncomeScenario(): FormState {
  const income = [
    makeIncomeItem(1, 10000, 'week'),     // €100 / week → ≈ €433.33 / maand
    makeIncomeItem(2, 30000, 'quarter'),  // €300 / kwartaal → €100 / maand
    makeIncomeItem(3, 1200000, 'year'),   // €12000 / jaar → €1000 / maand
  ];
  return makePhoenixStateWithHousehold({ adults: 2, children: 1 }, makeFinance(income, []));
}

export function makeCarExpensesScenario(autoCount = 2): FormState {
  const state = makePhoenixStateWithHousehold({ adults: 2, children: 0 });
  state.data.setup = { ...state.data.setup, autoCount: autoCount === 0 ? 'Nee' : (autoCount === 1 ? 'Een' : 'Twee') };
  state.data.finance = makeFinance(
    [makeIncomeItem(1, 200000, 'month')], // €2000
    [
      makeExpenseItem(1, 50000, 'month'), // wonen
      makeExpenseItem(2, 15000, 'month'), // verzekering/belasting
      makeExpenseItem(3, 20000, 'month'), // brandstof
    ],
  );
  return state;
}
