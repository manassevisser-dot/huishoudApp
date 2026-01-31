import type { FieldId, StateWriter as DomainStateWriter } from '@domain/core';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

/**
 * ADAPTER LAYER: StateWriter Façade
 * 
 * This adapter sits between UI (string fieldIds) and domain (FieldId types).
 * Provides validation/coercion via validateAtBoundary before writing to orchestrator.
 * 
 * ADR-01 Enforcement: Adapter is the only boundary between UI writes and domain
 * 
 * @example
 * const adapter = new StateWriterAdapter(orchestrator);
 * adapter.updateField('aantalMensen', '5'); // UI passes string
 * // → validates via boundary
 * // → coerces to number 5
 * // → calls orchestrator.updateField('aantalMensen', 5)
 */
export class StateWriterAdapter {
  constructor(private readonly domainWriter: DomainStateWriter) {}

  /**
   * Update field value with validation/coercion
   * 
   * Flow:
   * 1. Normalize string fieldId → FieldId (or fail-closed)
   * 2. Validate/coerce value via validateAtBoundary
   * 3. On success: update domain writer
   * 4. On failure: fail-closed (no throw, silent)
   * 
   * @param fieldId - Raw string fieldId from UI
   * @param value - Raw value from UI
   */
  updateField(fieldId: string, value: unknown): void {
    // Step 1: Normalize fieldId
    const normalizedFieldId = normalizeFieldId(fieldId);
    if (normalizedFieldId === null) {
      // Fail-closed: unknown fieldId, silently ignore
      return;
    }

    // Step 2: Validate/coerce via boundary
    const validationResult = validateAtBoundary(normalizedFieldId, value);
    if (!validationResult.success) {
      // Fail-closed: validation failed, silently ignore
      return;
    }

    // Step 3: Update domain writer with validated/coerced value
    this.domainWriter.updateField(normalizedFieldId, validationResult.data);
  }
}

/**
 * Helper: Normalize string fieldId to FieldId type
 * 
 * Mirrors FormStateValueProvider.normalizeFieldId logic
 * 
 * @param raw - Raw string fieldId from UI
 * @returns Normalized FieldId or null if unknown
 */
function normalizeFieldId(raw: string): FieldId | null {
  const cleanId = raw.replace(/^data\./, '');
  
  // Split into smaller functions to reduce complexity
  if (cleanId.startsWith('aantal')) {
    return normalizeAantalFields(cleanId);
  }
  if (cleanId.startsWith('auto')) {
    return normalizeAutoFields(cleanId);
  }
  if (cleanId === 'members') return 'members';
  if (cleanId === 'grossMonthly') return 'grossMonthly';
  if (cleanId === 'inkomstenPerLid') return 'inkomstenPerLid';
  if (cleanId === 'heeftHuisdieren') return 'heeftHuisdieren';
  if (cleanId === 'car_repeater') return 'car_repeater';
  if (cleanId === 'kinderenLabel') return 'kinderenLabel';
  
  return null;
}

/**
 * Helper: Normalize aantal* fields
 */
function normalizeAantalFields(id: string): FieldId | null {
  if (id === 'aantalMensen') return 'aantalMensen';
  if (id === 'aantalVolwassen') return 'aantalVolwassen';
  return null;
}

/**
 * Helper: Normalize auto* fields
 */
function normalizeAutoFields(id: string): FieldId | null {
  if (id === 'autoCount') return 'autoCount';
  return null;
}