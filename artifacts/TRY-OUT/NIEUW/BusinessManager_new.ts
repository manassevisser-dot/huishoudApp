// src/app/orchestrators/managers/BusinessManager.ts
/**
 * @file_intent Implementeert de IBusinessOrchestrator interface en fungeert als de centrale manager voor bedrijfslogica-transformaties.
 * @repo_architecture Mobile Industry (MI) - Business Logic Management Layer.
 * @term_definition FinancialOrchestrator = De onderliggende domein-orchestrator die de daadwerkelijke financiële berekeningen en valuta-formattering uitvoert.
 * @contract De BusinessManager dient als een facade; het ontsluit complexe domein-berekeningen (via de FinancialOrchestrator) aan de UI-laag in een consistent formaat (FinancialSummaryVM).
 * @ai_instruction Deze klasse is ontworpen om lichtgewicht te blijven.
 *   Voeg hier geen zware rekenlogica toe, maar delegeer deze naar gespecialiseerde domein-orchestrators.
 *   De recompute()-methode ontvangt fso als parameter (NIET in constructor) zodat de klasse stateless blijft.
 * @changes [Fase 2] Toegevoegd: recompute(fso) — centraliseert de UPDATE_VIEWMODEL dispatch.
 *   Vervangt MasterOrchestrator.recomputeBusinessState(). FSO als methode-param, niet constructor-dep.
 */
import { FormState } from '@core/types/core';
import { IBusinessOrchestrator, FinancialSummaryVM } from '../interfaces/IBusinessOrchestrator';
import { FinancialOrchestrator } from '../FinancialOrchestrator';
import type { FormStateOrchestrator } from '../FormStateOrchestrator';

export class BusinessManager implements IBusinessOrchestrator {
  constructor(private readonly financialOrch: FinancialOrchestrator) {}

  // ─── Bestaande methode (ongewijzigd) ─────────────────────────────
  public prepareFinancialViewModel(state: FormState): FinancialSummaryVM {
    return this.financialOrch.prepareViewModel(state);
  }

  // ─── Nieuw: gecentraliseerde recompute [Fase 2] ───────────────────
  /**
   * Herberekent de financiële samenvatting en dispatcht UPDATE_VIEWMODEL.
   * Wordt aangeroepen door alle orchestrators die state muteren.
   *
   * @param fso - Doorgegeven als methode-parameter om de klasse stateless te houden.
   *   Geen constructor-injectie van FSO; dit voorkomt een circulaire afhankelijkheid
   *   en behoudt de onafhankelijkheid van BusinessManager.
   */
  public recompute(fso: FormStateOrchestrator): void {
    const summary = this.prepareFinancialViewModel(fso.getState());

    fso.dispatch({
      type: 'UPDATE_VIEWMODEL',
      payload: { financialSummary: summary },
    });
  }
}
