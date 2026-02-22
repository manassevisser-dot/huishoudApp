// src/app/orchestrators/FormStateOrchestrator.ts
/**
 * @file_intent De exclusieve interface voor het lezen en schrijven van FormState.
 * @repo_architecture Mobile Industry (MI) - State Management Layer.
 * @term_definition StateWriterAdapter = De abstractielaag die de werkelijke Redux/State mutaties uitvoert.
 * @contract Alleen deze orchestrator mag veld-waarden ophalen (getValue) of muteren (updateField) via de writer.
 * @ai_instruction Bij uitbreiding van de state-structuur (bijv. nieuwe domeinen), voeg hier de bijbehorende getter-logica toe.
 */
import { type FormState } from '@core/types/core';
import type { FormAction } from '@app/state/formReducer';
import { StateWriterAdapter } from '@adapters/StateWriter/StateWriterAdapter';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

// We leiden de types lokaal af van de FormState. 
// NonNullable zorgt dat de array-access veilig is voor TypeScript.
type IncomeItem = NonNullable<FormState['data']['finance']['income']['items']>[number];
type ExpenseItem = NonNullable<FormState['data']['finance']['expenses']['items']>[number];

export class FormStateOrchestrator {
  private readonly writer: StateWriterAdapter;

  constructor(
    public readonly getState: () => FormState,
    public readonly dispatch: (action: FormAction) => void
  ) {
    this.writer = new StateWriterAdapter(this.getState, (a) => this.dispatch(a as FormAction));
  }

  public getValue(fieldId: string): unknown {
    const state = this.getState();

    const financialValue = this.getFinancialValue(state, fieldId);
    if (financialValue !== undefined) return financialValue;

    return this.getSectionValue(state, fieldId);
  }

  private getFinancialValue(state: FormState, fieldId: string): unknown {
    const incomeItems = state.data.finance.income.items as IncomeItem[];
    if (Array.isArray(incomeItems)) {
      // Gebruik expliciete check it !== undefined && it !== null voor de linter
      const hit = incomeItems.find((it) => it !== undefined && it !== null && it.fieldId === fieldId);
      if (hit !== undefined && hit !== null) return hit.amount as unknown;
    }

    const expenseItems = state.data.finance.expenses.items as ExpenseItem[];
    if (Array.isArray(expenseItems)) {
      const hit = expenseItems.find((it) => it !== undefined && it !== null && it.fieldId === fieldId);
      if (hit !== undefined && hit !== null) return hit.amount as unknown;
    }
    return undefined;
  }

  private getSectionValue(state: FormState, fieldId: string): unknown {
    const setup = state.data.setup as Record<string, unknown>;
    // De linter eist expliciete checks op objecten
    if (setup !== undefined && setup !== null && fieldId in setup) {
      return setup[fieldId];
    }

    const household = state.data.household as Record<string, unknown>;
    if (household !== undefined && household !== null && fieldId in household) {
      return household[fieldId];
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