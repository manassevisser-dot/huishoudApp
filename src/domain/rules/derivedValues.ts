/**
 * @file_intent Definieert regels voor het afleiden van nieuwe, berekende waarden uit de bestaande formulier- of applicatiestaat. Deze afgeleide waarden worden vaak gebruikt om dynamische labels, samenvattingen of andere informatieve teksten in de UI te tonen die in real-time reageren op de input van de gebruiker.
 * @repo_architecture Domain Layer - Business Rules.
 * @term_definition
 *   - `Derived Value Rule`: Een pure functie die data uit een context (`VisibilityContext`) leest, er een berekening op uitvoert (bv. `totaal - deel`), en een nieuw, afgeleid gegeven retourneert. Dit is geen data die wordt opgeslagen in de state, maar die "on-the-fly" wordt berekend voor weergavedoeleinden.
 *   - `VisibilityContext`: Het object dat de actuele staat van het formulier bevat en als input dient voor de regel, waardoor de regel toegang heeft tot alle benodigde waarden.
 *   - `ADR-06 (Nullish Coalescing)`: De `??` operator wordt gebruikt als een defensieve maatregel. Het zorgt ervoor dat als een waarde `null` of `undefined` is, er een veilige standaardwaarde (`0`) wordt gebruikt in de berekening, wat `NaN` (Not a Number) resultaten voorkomt en de robuustheid verhoogt.
 * @contract Het bestand exporteert een `derivedValueRules` object. Elke eigenschap in dit object is een functie die een `VisibilityContext` als argument neemt en een `number` (of `string`) retourneert. De `kinderenLabel` regel berekent en retourneert bijvoorbeeld het aantal kinderen op basis van het totaal aantal mensen en het aantal volwassenen in het huishouden.
 * @ai_instruction De afgeleide waarden in dit bestand worden aangeroepen door een **orchestrator-laag**. De orchestrator gebruikt de output van deze regels (bv. `kinderenLabel`) om de UI-staat te construeren. De mobiele UI is "dom" en rendert enkel de staat die door de orchestrator wordt aangeleverd. Een orchestrator zou bijvoorbeeld `derivedValueRules.kinderenLabel(context)` aanroepen en het resultaat opnemen in het state-object dat naar de UI wordt gestuurd, waar het wordt weergegeven in een label. Dit zorgt voor een strikte scheiding tussen business-logica (domein) en weergave (UI), en centraliseert de state-management logica in de orchestrators.
 */

// src/domain/rules/derivedValues.ts
import { VisibilityContext } from './fieldVisibility';

export const derivedValueRules = {
  /**
   * Business Rule: "Aantal kinderen = totaal mensen - volwassenen (minimum 0)"
   * Wordt gebruikt om dynamische labels of helper-teksten te genereren.
   */
  kinderenLabel: (ctx: VisibilityContext): number => {
    // FIX: Gebruik ?? in plaats van || voor getallen (ADR-06)
    const n = (ctx.getValue('aantalMensen') as number | undefined) ?? 0;
    const m = (ctx.getValue('aantalVolwassen') as number | undefined) ?? 0;
    
    return Math.max(0, n - m);
  }
};