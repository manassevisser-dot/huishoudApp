// src/app/orchestrators/FinancialOrchestrator.ts
/**
 * @file_intent Pure transformatie-logica voor financiële data-presentatie.
 * @repo_architecture Mobile Industry (MI) - Business/Presentation Layer.
 * @term_definition PhoenixSummary = De berekende totalen (in centen) uit de domain rules.
 * @contract Stateless. Zet ruwe centen-waarden om naar gelokaliseerde display-strings (ViewModel).
 * @ai_instruction Bevat GEEN business rules (die zitten in @domain/rules). Bevat GEEN state-mutaties.
 */
import { computePhoenixSummary } from '@domain/rules/calculateRules';
import { formatCurrency } from '@domain/helpers/numbers';
import { FormStateOrchestrator } from './FormStateOrchestrator';
import type { FormState } from '@core/types/core';
import type { FinancialSummaryVM } from './interfaces/IBusinessOrchestrator';

export class FinancialOrchestrator {
  /**
   * De constructor staat klaar voor Dependency Injection vanuit useStableOrchestrator.
   * Hoewel we 'state' als argument in prepareViewModel gebruiken, houdt de fso de referentie
   * naar de motor van de state-machine vast voor eventuele toekomstige diepere integraties.
   */
  constructor(private readonly fso: FormStateOrchestrator) {}

  /**
   * Vertaalt de ruwe finance data naar een ViewModel voor de UI.
   * Volgt de regel: State In -> ViewModel Out.
   */
  public prepareViewModel(state: FormState): FinancialSummaryVM {
    const finance = state.data?.finance;
    
    // De check is nu expliciet en veilig voor strict-boolean-expressions
    if (finance === undefined || finance === null) {
      return {
        totalIncomeDisplay: '€ 0,00',
        totalExpensesDisplay: '€ 0,00',
        netDisplay: '€ 0,00',
      };
    }

    const summary = computePhoenixSummary(finance);

    return {
      totalIncomeDisplay: formatCurrency(summary.totalIncomeCents),
      totalExpensesDisplay: formatCurrency(summary.totalExpensesCents),
      netDisplay: formatCurrency(summary.netCents),
    };
  }
}