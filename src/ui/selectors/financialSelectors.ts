/**
 * @file_intent Biedt pure "selector"-functies voor het extraheren van specifieke, vooraf opgemaakte `ViewModels` uit de centrale `FormState` van de applicatie. Het doel is om UI-componenten te isoleren van de complexe structuur van de state-tree.
 * @repo_architecture UI Layer - State Selector. Selectors fungeren als een query-taal voor de state van de applicatie. Ze vormen de brug tussen de centrale state (`@core`) en de UI-componenten (`@ui`), en zorgen ervoor dat componenten alleen de data ontvangen die ze nodig hebben, zonder de structuur van de state te hoeven kennen.
 * @term_definition
 *   - `Selector`: Een pure functie die de volledige `FormState` als input neemt en een specifieke dataselectie (meestal een `ViewModel`) retourneert.
 *   - `FormState`: De 'single source of truth' voor de state van de applicatie, beheerd door de `@core`-laag.
 *   - `ViewModel`: Een data-object dat is voorbereid door een orchestrator, met data die klaar is voor weergave in de UI.
 *   - `selectFinancialSummaryVM`: De specifieke selector in dit bestand voor het ophalen van het financiële overzicht-`ViewModel`.
 * @contract De selector-functie ontvangt het volledige `FormState`-object. Het navigeert naar `state.viewModels.financialSummary` en retourneert de waarde. Als het pad ongeldig is of de data ontbreekt, retourneert het een standaard, "leeg" `financialSummary`-object om een consistent returntype te garanderen en UI-fouten te voorkomen.
 * @ai_instruction Gebruik deze selector in UI-componenten om de data van het financiële overzicht op te halen. Benader de state-tree niet rechtstreeks. Dit bestand is alleen bedoeld voor het *selecteren* van state. De logica voor het *creëren* of *berekenen* van de `financialSummary`-ViewModel hoort thuis in de `MasterOrchestrator`. Voeg hier nieuwe selector-functies toe om andere `ViewModels` op een veilige manier aan de UI beschikbaar te stellen.
 */
import type { FormState } from '@core/types/core';

/**
 * Selecteert de financiële samenvatting die al door de Orchestrator 
 * is voorbereid en geformatteerd.
 * * ✅ Geen imports van @kernel of @domain (Integrity Guard blij)
 * ✅ Geen berekeningen (Pure selector)
 */
export const selectFinancialSummaryVM = (state: FormState) => {
  return state.viewModels?.financialSummary ?? {
    totalIncomeDisplay: '€ 0,00',
    totalExpensesDisplay: '€ 0,00',
    netDisplay: '€ 0,00',
  };
};