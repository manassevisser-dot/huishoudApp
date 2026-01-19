import { ValueProvider } from './ValueProvider';

/**
 * TypeGuard voor numerieke waarden (fail-closed).
 */
export function isNumeric(value: unknown): value is number {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return false; // lege string ≠ 0
    return !isNaN(Number(trimmed)) && isFinite(Number(trimmed));
  }
  return false;
}

/**
 * Evalueert een visibility-condition.
 * Fail-closed: onbekende operator → false.
 */
export function evaluateVisibilityCondition(
  condition: { field: string; operator: string; value: unknown },
  provider: ValueProvider
): boolean {
  const fieldValue = provider.getValue(condition.field);

  switch (condition.operator) {
    case 'eq':
      return fieldValue === condition.value;
    case 'neq':
      return fieldValue !== condition.value;
    case 'gt':
      if (!isNumeric(fieldValue) || !isNumeric(condition.value)) return false;
      return Number(fieldValue) > Number(condition.value);
    case 'lt':
      if (!isNumeric(fieldValue) || !isNumeric(condition.value)) return false;
      return Number(fieldValue) < Number(condition.value);
    case 'truthy':
      return !!fieldValue;
    default:
      return false; // fail-closed
  }
}