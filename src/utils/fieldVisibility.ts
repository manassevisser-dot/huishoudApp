import type { FieldConfig, FormState } from '@shared-types/form';
import { evaluateVisibilityCondition } from '../domain/rules/visibilityRules';
import { FormStateValueProvider } from '../app/orchestrators/FormStateValueProvider';

/**
 * Centraal startpunt voor zichtbaarheid checks.
 * Ondersteunt:
 * 1. Legacy functies (callback met state)
 * 2. Legacy strings (checkt of waarde truthy is)
 * 3. Nieuwe Domain Rules (objecten met field/operator/value)
 */
export function evaluateVisibleIf(visibleIf: FieldConfig['visibleIf'], state: FormState): boolean {
  if (!visibleIf) return true;

  // 1. Handmatige functies blijven ondersteund voor complexe edge-cases
  if (typeof visibleIf === 'function') {
    return visibleIf(state);
  }

  const valueProvider = new FormStateValueProvider(state.data);

  // 2. Legacy strings omzetten naar een formaat dat de engine begrijpt
  if (typeof visibleIf === 'string') {
    return evaluateVisibilityCondition({
      field: visibleIf,
      operator: 'truthy', // We voegen 'truthy' toe aan de engine of handelen het hier af
      value: true
    }, valueProvider);
  }

  // 3. Nieuwe engine route voor objecten
  return evaluateVisibilityCondition(visibleIf as { field: string; operator: string; value: unknown }, valueProvider);
}