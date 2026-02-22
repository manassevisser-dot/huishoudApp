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
import { logger } from '@adapters/audit/AuditLoggerAdapter';

export type VisibilityParams = { memberId?: string };
/**
 * Type-definitie voor een visibility rule.
 * Ontvangen context met een getValue functie en een optionele memberId.
 * Geeft ALTIJD een boolean terug.
 */
type VisibilityRule = (
  context: { getValue: (fieldId: string) => unknown },
  memberId?: string,
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
  const rules = fieldVisibilityRules as Record<string, VisibilityRule | undefined>;
  const rule = rules[ruleName];

  if (rule === undefined || typeof rule !== 'function') {
    if (ruleName !== '') {
      logger.error('visibility_rule_missing_fail_closed', {
        orchestrator: 'visibility',
        action: 'evaluate',
        ruleName,
        memberId,
        failClosed: true,
      });
    }
    return false;
  }

  return this.executeRule(rule, memberId);
}

private executeRule(rule: VisibilityRule, memberId?: string): boolean {
  const context = { getValue: (fieldId: string) => this.fso.getValue(fieldId) };
  try {
    return Boolean(rule(context, memberId));
  } catch (error) {
    logger.error('visibility_rule_execution_failed', {
      orchestrator: 'visibility',
      action: 'evaluate',
      failClosed: true,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
}