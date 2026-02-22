// src/app/orchestrators/VisibilityOrchestrator.ts
/**
 * @file_intent Evalueert dynamische zichtbaarheidsregels (show/hide) op basis van de actuele applicatie-state.
 * @repo_architecture Mobile Industry (MI) - Business Rules / Logic Layer.
 * @term_definition Fail-closed = Een veiligheidsprincipe waarbij een veld bij twijfel of fouten ALTIJD verborgen wordt.
 * @contract Stateless evaluator. Verbindt de FormStateOrchestrator (data) met de fieldVisibilityRules (domein-logica).
 * @ai_instruction Zichtbaarheid is leidend voor validatie en rendering. Als evaluate() false geeft, mag de UI het veld niet renderen en de validatie het veld niet controleren.
 */

import { FormStateOrchestrator } from './FormStateOrchestrator'; 
import { fieldVisibilityRules } from '@domain/rules/fieldVisibility';

export type VisibilityParams = { memberId?: string; };
// TODO (SPRINT-2):
// VisibilityContext should not cross Render boundary.
// This will be resolved when UIManager encapsulates visibility.
/**
 * Type-definitie voor een visibility rule.
 * Ontvangen context met een getValue functie en een optionele memberId.
 * Geeft ALTIJD een boolean terug.
 */
type VisibilityRule = (
  context: { getValue: (fieldId: string) => unknown },
  memberId?: string
) => boolean;

export class VisibilityOrchestrator {
  constructor(private readonly fso: FormStateOrchestrator) {}

  /**
   * Evalueert of een veld zichtbaar moet zijn op basis van de regelnaam.
   * Maakt gebruik van de regels gedefinieerd in fieldVisibility.ts.
   * * @param ruleName De naam van de regel zoals gedefinieerd in de EntryRegistry
   * @param memberId Optionele ID voor regels die context van een specifiek lid nodig hebben
   * @returns boolean - Of het veld getoond moet worden (Fail-closed: false bij fouten)
   */
  public evaluate(ruleName: string, memberId?: string): boolean {
    // 1. Cast de geïmporteerde regels naar een veilig Record type voor lookup
    const rules = fieldVisibilityRules as Record<string, VisibilityRule | undefined>;
    const rule = rules[ruleName];
    
    // 2. Fail-closed check: Bestaat de regel en is het een functie?
    if (rule === undefined || typeof rule !== 'function') {
      // Alleen loggen als er echt een regelnaam was opgegeven maar niet gevonden
      if (ruleName !== '') {
        console.error(`[VisibilityOrchestrator] Rule '${ruleName}' niet gevonden in fieldVisibility.ts. Fail-closed geactiveerd.`);
      }
      return false; 
    }

    // 3. Bouw de context die de regels in fieldVisibility.ts verwachten
    const context = {
      getValue: (fieldId: string): unknown => this.fso.getValue(fieldId)
    };

    // 4. Voer de regel uit binnen een try-catch voor extra veiligheid
    try {
      const result = rule(context, memberId);
      // Forceer resultaat naar boolean (voor het geval de regel per ongeluk iets anders teruggeeft)
      return Boolean(result);
    } catch (error) {
      console.error(`[VisibilityOrchestrator] Error tijdens uitvoeren van rule '${ruleName}':`, error);
      return false; // Bij een crash in de regel zelf: verberg het veld
    }
  }
}