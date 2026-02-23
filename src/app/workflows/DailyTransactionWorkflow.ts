// src/app/workflows/DailyTransactionWorkflow.ts
/**
 * @file_intent Coördineert de volledige workflow voor het opslaan van een dagelijkse transactie.
 * @repo_architecture Mobile Industry (MI) - Workflow Layer.
 * @term_definition
 *   ExpenseItem = Een opgeslagen uitgavepost in finance.expenses.items.
 *   latestTransaction = Tijdelijke state die de gebruiker net heeft ingevuld (wordt gereset na opslaan).
 * @contract
 *   execute(fso, business) → valideert, bouwt ExpenseItem, persisteert, reset formulier, herberekent.
 *   Retourneert true bij succes, false bij validatiefout.
 * @ai_instruction Dit is de ENIGE nieuwe orchestrator-klasse die voortvloeit uit de splitsing.
 *   Alle andere orchestrators zijn uitbreidingen van bestaande bestanden.
 *   FormStateOrchestrator en BusinessManager worden als params ontvangen (stateless aanpak).
 *   Domeinfuncties (computePhoenixSummary) worden direct geïmporteerd, niet gedupliceerd.
 * @migration Verplaatst uit MasterOrchestrator:
 *   - saveDailyTransaction()
 *   - buildExpenseItemForTransaction()
 *   - persistTransactionAndReset()
 */

import { logger } from '@adapters/audit/AuditLoggerAdapter';
import { computePhoenixSummary } from '@domain/rules/calculateRules';
import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import type { BusinessManager } from '@app/orchestrators/managers/BusinessManager';
import type { ExpenseItem } from '@core/types/core';

// Type-alias voor latestTransaction state — afgeleid van FormState
// Type-alias voor latestTransaction state — afgeleid van FormState
type LatestTransaction = NonNullable<
  ReturnType<FormStateOrchestrator['getState']>['data']['latestTransaction']
>;

export class DailyTransactionWorkflow {
  /**
   * Voert de volledige daily-transaction workflow uit.
   *
   * @param fso      - Voor getState() en dispatch(); als param voor stateless aanpak.
   * @param business - BusinessManager voor recompute na opslaan.
   * @returns true als de transactie succesvol is opgeslagen, false bij validatiefout.
   */
  public execute(fso: FormStateOrchestrator, business: BusinessManager): boolean {
    const tx = fso.getState().data.latestTransaction;

    // Validatie (met type guard)
    if (!this.isTransactionValid(tx)) return false;

    // Uitvoering — TypeScript weet nu: tx is LatestTransaction EN category is string
    const expenseItem = this.buildExpenseItem(tx, tx.latestTransactionCategory);
    this.persistAndReset(expenseItem, fso);
    business.recompute(fso);

    logger.info('transaction_saved', {
      workflow: 'dailyTransaction',
      action: 'execute',
      fieldId: expenseItem.fieldId,
    });
    return true;
  }

  private isTransactionValid(
    tx: LatestTransaction | null | undefined
  ): tx is LatestTransaction & { latestTransactionCategory: string } {
    // Expliciete null-check
    if (tx === null || tx === undefined) {
      logger.warn('transaction_form_not_initialized', { workflow: 'dailyTransaction' });
      return false;
    }

    // Expliciete checks voor elk veld
    if (typeof tx.latestTransactionAmount !== 'number' || tx.latestTransactionAmount <= 0) {
      logger.warn('transaction_invalid_amount', { 
        workflow: 'dailyTransaction', 
        amount: tx.latestTransactionAmount 
      });
      return false;
    }

    if (typeof tx.latestTransactionCategory !== 'string' || tx.latestTransactionCategory === '') {
      logger.warn('transaction_category_required', { workflow: 'dailyTransaction' });
      return false;
    }

    return true;
  }

  // ─── Private helpers ──────────────────────────────────────────────

  private buildExpenseItem(
    tx: LatestTransaction & { latestTransactionCategory: string }, 
    category: string
  ): ExpenseItem {
    return {
      fieldId: `expense_${Date.now()}`,
      amount: tx.latestTransactionAmount,
      category,
      description: tx.latestTransactionDescription ?? '',
      paymentMethod: tx.latestPaymentMethod ?? 'pin',
      date: tx.latestTransactionDate ?? new Date().toISOString().split('T')[0],
    };
  }

  private persistAndReset(expenseItem: ExpenseItem, fso: FormStateOrchestrator): void {
    const state = fso.getState();
    const currentExpenses: ExpenseItem[] = state.data.finance.expenses.items ?? [];
    const updatedExpenses = [...currentExpenses, expenseItem];

    // Gebruik domeincalculatie — niet dupliceren
    const financeData = {
      income: state.data.finance.income,
      expenses: { ...state.data.finance.expenses, items: updatedExpenses },
    };
    const summary = computePhoenixSummary(financeData);

    fso.dispatch({
      type: 'UPDATE_DATA',
      payload: {
        finance: {
          ...state.data.finance,
          expenses: {
            ...state.data.finance.expenses,
            items: updatedExpenses,
            totalAmount: summary.totalExpensesCents,
          },
        },
        latestTransaction: {
          latestTransactionDate: new Date().toISOString().split('T')[0],
          latestTransactionAmount: 0,
          latestTransactionCategory: null,
          latestTransactionDescription: '',
          latestPaymentMethod: 'pin',
        },
      },
    });
  }
}