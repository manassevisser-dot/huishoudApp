import { validateFieldInput } from './fieldValidator';

/**
 * PHOENIX STEP VALIDATOR (Unified)
 * Evalueert alle velden in een wizardstap volgens ADR-01.
 * 
 * @param stepData - Record met fieldId → value mappings
 * @returns true bij volledige validiteit, { errors: Record<fieldId, errorMsg> } bij schending
 */
export function validateStep(
  stepData: Record<string, unknown>
): true | { errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Itereer over alle velden in de stap
  for (const fieldId in stepData) {
    // ESLint strict: gebruik hasOwnProperty via call
    if (!Object.prototype.hasOwnProperty.call(stepData, fieldId)) {
      continue;
    }

    const value = stepData[fieldId];
    const error = validateFieldInput(fieldId, value);

    if (error !== null) {
      errors[fieldId] = error;
    }
  }

  // Return true als geen fouten, anders { errors }
  if (Object.keys(errors).length === 0) {
    return true;
  }

  return { errors };
}

/**
 * P2 Foundation: Determines if wizard can proceed to next step
 * 
 * @pure function - no side effects, deterministic output
 * @param activeFields - List of field IDs that must be completed
 * @param formData - Current form state
 * @returns true if step is complete and can proceed, false otherwise
 */
export function canGoNext(
  activeFields: string[],
  formData: unknown
): boolean {
  // Fail-closed: validate inputs
  if (!isValidInput(activeFields, formData)) {
    return false;
  }
  
  // Check all fields have values
  const data = formData as Record<string, unknown>;
  return allFieldsHaveValues(activeFields, data);
}

/**
 * Helper: Validate inputs are non-empty
 */
function isValidInput(activeFields: string[], formData: unknown): boolean {
  if (!Array.isArray(activeFields) || activeFields.length === 0) {
    return false;
  }
  
  if (formData === null || formData === undefined || typeof formData !== 'object') {
    return false;
  }
  
  return true;
}

/**
 * Helper: Check all fields have non-empty values
 */
function allFieldsHaveValues(
  fieldIds: string[],
  data: Record<string, unknown>
): boolean {
  for (const fieldId of fieldIds) {
    if (!hasValue(data[fieldId])) {
      return false;
    }
  }
  
  return true;
}

/**
 * Helper: Check if value is non-empty
 */
function hasValue(value: unknown): boolean {
  // Fail if undefined, null, or empty string
  if (value === undefined || value === null) {
    return false;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  
  return true;
}