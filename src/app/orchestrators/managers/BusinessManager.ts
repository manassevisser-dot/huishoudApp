import { FormState } from '@core/types/core';
// Importeer de interface en de orchestrator-interface van de juiste plek
import { IBusinessOrchestrator, FinancialSummaryVM } from '@app/orchestrators/interfaces/IBusinessOrchestrator';
import { FinancialOrchestrator } from '@app/orchestrators/FinancialOrchestrator';

export class BusinessManager implements IBusinessOrchestrator {
  /**
   * Bereidt het financieel overzicht voor op basis van de actuele formulierstatus.
   * @param state De volledige FormState vanuit de FormStateOrchestrator
   */
  public prepareFinancialViewModel(state: FormState): FinancialSummaryVM {
    // FinancialOrchestrator.prepareViewModel moet dus ook FinancialSummaryVM teruggeven
    return FinancialOrchestrator.prepareViewModel(state);
  }
}