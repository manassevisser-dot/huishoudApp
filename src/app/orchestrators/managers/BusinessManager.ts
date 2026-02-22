// src/app/orchestrators/BusinessManager.ts
/**
 * @file_intent Implementeert de IBusinessOrchestrator interface en fungeert als de centrale manager voor bedrijfslogica-transformaties.
 * @repo_architecture Mobile Industry (MI) - Business Logic Management Layer.
 * @term_definition FinancialOrchestrator = De onderliggende domein-orchestrator die de daadwerkelijke financiële berekeningen en valuta-formattering uitvoert.
 * @contract De BusinessManager dient als een facade; het ontsluit complexe domein-berekeningen (via de FinancialOrchestrator) aan de UI-laag in een consistent formaat (FinancialSummaryVM).
 * @ai_instruction Deze klasse is ontworpen om lichtgewicht te blijven. 
 * Voeg hier geen zware rekenlogica toe, maar delegeer deze naar gespecialiseerde domein-orchestrators. 
 * De BusinessManager is verantwoordelijk voor de orchestratie van deze verschillende domein-outputs tot één samenhangend resultaat voor de presentatielaag.
 */
// src/app/orchestrators/managers/BusinessManager.ts
import { FormState } from '@core/types/core';
import { IBusinessOrchestrator, FinancialSummaryVM } from '../interfaces/IBusinessOrchestrator';
import { FinancialOrchestrator } from '../FinancialOrchestrator';

export class BusinessManager implements IBusinessOrchestrator {
  constructor(private readonly financialOrch: FinancialOrchestrator) {}

  public prepareFinancialViewModel(state: FormState): FinancialSummaryVM {
    return this.financialOrch.prepareViewModel(state);
  }
}