import type { FormState } from '@core/types/core';
import type { FormAction } from '@app/context/formReducer';
import { StateWriterAdapter } from '@adapters/StateWriter/StateWriterAdapter';
import { DATA_KEYS } from '@domain/constants/datakeys';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

type IncomeItem  = FormState['data']['finance']['income'   ]['items'][number];
type ExpenseItem = FormState['data']['finance']['expenses']['items'][number];

export class FormStateOrchestrator {
  private readonly writer: StateWriterAdapter;

  constructor(
    public readonly getState: () => FormState,
    public readonly dispatch: (action: FormAction) => void
  ) {
    // FIX 1: 'any' vervangen door expliciete cast naar het type dat de adapter verwacht
    this.writer = new StateWriterAdapter(this.getState, (a) => this.dispatch(a as FormAction));
  }

  // FIX 2: Complexiteit verlaagd door getValue op te splitsen in kleine delen
  public getValue(fieldId: string): unknown {
    const state = this.getState();

    const financialValue = this.getFinancialValue(state, fieldId);
    if (financialValue !== undefined) return financialValue;

    return this.getSectionValue(state, fieldId);
  }

  private getFinancialValue(state: FormState, fieldId: string): unknown {
    const incomeItems = state.data[DATA_KEYS.FINANCE]?.income?.items;
    if (Array.isArray(incomeItems)) {
      const hit = (incomeItems as ReadonlyArray<IncomeItem>).find((it) => it.fieldId === fieldId);
      if (hit !== undefined) return hit.amount;
    }

    const expenseItems = state.data[DATA_KEYS.FINANCE]?.expenses?.items;
    if (Array.isArray(expenseItems)) {
      const hit = (expenseItems as ReadonlyArray<ExpenseItem>).find((it) => it.fieldId === fieldId);
      if (hit !== undefined) return hit.amount;
    }
    return undefined;
  }

  private getSectionValue(state: FormState, fieldId: string): unknown {
    for (const key of [DATA_KEYS.SETUP, DATA_KEYS.HOUSEHOLD]) {
      const section = state.data[key];
      // FIX 3: Strict boolean check (niet 'if (section)')
      if (section !== undefined && section !== null && Object.prototype.hasOwnProperty.call(section, fieldId)) {
        return (section as Record<string, unknown>)[fieldId];
      }
    }
    return undefined;
  }

  public updateField(fieldId: string, validatedValue: unknown): void {
    this.writer.updateField(fieldId, validatedValue);
  }

  public getValidationError(fieldId: string, value: unknown): string | null {
    const r = validateAtBoundary(fieldId, value);
    return r.success ? null : r.error;
  }
}