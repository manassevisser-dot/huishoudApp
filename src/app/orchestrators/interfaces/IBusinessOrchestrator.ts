// src/app/orchestrators/interfaces/IBusinessOrchestrator.ts
/**
 * @file_intent Definieert het contract voor de Business Orchestrator, verantwoordelijk voor het berekenen van afgeleide data (ViewModels) uit de ruwe domeinstate.
 * @repo_architecture Mobile Industry (MI) - Business Logic Interface Layer.
 * @term_definition FinancialSummaryVM = Een presentatie-model dat berekende totalen (inkomsten, uitgaven, netto) bevat, geformatteerd als leesbare strings voor de UI.
 * @contract Dwingt een pure transformatie af: de orchestrator neemt de volledige FormState en vertaalt deze naar een specifiek UI-behoeften-pakket (FinancialSummary) zonder de originele state te muteren.
 * @ai_instruction Implementaties van deze interface moeten zich focussen op rekenregels en aggregaties. Gebruik deze interface om de UI los te koppelen van de complexe berekeningen achter de financiële samenvatting.
 */
import type { FormState } from '@core/types/core';

export interface FinancialSummaryVM {
    totalIncomeDisplay: string;
    totalExpensesDisplay: string;
    netDisplay: string;
  }
  
  export interface IBusinessOrchestrator {
    prepareFinancialViewModel(state: FormState): FinancialSummaryVM;
  }