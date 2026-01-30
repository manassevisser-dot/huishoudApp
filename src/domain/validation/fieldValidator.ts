import { validateField as validateFieldConstraint } from '../rules/fieldConstraints';
import { isDigitsDatePlausible } from './dateValidators';
import { calculateAge } from '../rules/ageBoundaryRules';
import { validationMessages } from '@state/schemas/sections/validationMessages';

/**
 * PHOENIX VALIDATOR (Unified)
 * Implementeert de validatielogica door te delegeren naar de fieldConstraints registry.
 * @returns null bij succes, string bij fout (conform ADR-01 Outcome Consistency)
 */
export function validateFieldInput(fieldId: string, value: unknown): string | null {
  // Delegeer naar de constraint logic (die returns { isValid: boolean; error?: string })
  const result = validateFieldConstraint(fieldId, value);

  // Transformeer naar het contract van deze functie: null = OK, string = Error
  if (result.isValid) {
    return null;
  }

  // Fix ESLint: Use nullish coalescing (??) instead of OR (||) to avoid implicit boolean check on string
  return result.error ?? "Ongeldige invoer";
}

/**
 * P2 Foundation: validateField export (shim for test compatibility)
 * 
 * @pure function - no side effects, deterministic output
 * @param fieldId - Field identifier (or path for legacy compatibility)
 * @param value - Value to validate
 * @param _state - Optional form state for context-dependent validation (unused in P2)
 * @returns null if valid, error message string if invalid
 */
export function validateField(
  fieldId: string,
  value: unknown,
  _state?: unknown
): string | null {
  // P2 shim: delegate to existing validateFieldInput
  // state parameter unused until P3 (prefixed with _ per ESLint convention)
  return validateFieldInput(fieldId, value);
}

/**
 * P2 Foundation: Validates Dutch date of birth in DD-MM-YYYY format
 * 
 * @pure function - no side effects, deterministic output
 * @param ddmmyyyy - Date string in DD-MM-YYYY format
 * @returns null if valid, error message if invalid
 * 
 * Delegates to existing dateValidators.ts and ageBoundaryRules.ts
 */
export function validateDobNL(ddmmyyyy: unknown): string | null {
  // Type guard
  if (typeof ddmmyyyy !== 'string') {
    return validationMessages.dateOfBirth.invalidType;
  }
  
  // Delegate to existing date validator (from dateValidators.ts)
  if (!isDigitsDatePlausible(ddmmyyyy)) {
    return validationMessages.dateOfBirth.invalidFormat;
  }
  
  // Convert DD-MM-YYYY to ISO format (YYYY-MM-DD)
  const iso = convertDutchToISO(ddmmyyyy);
  if (iso === null) {
    return validationMessages.dateOfBirth.invalidDate;
  }
  
  // Delegate to existing age calculator (from ageBoundaryRules.ts)
  const age = calculateAge(iso);
  if (age === null) {
    return validationMessages.dateOfBirth.invalidDate;
  }
  
  // Simple age check
  const MIN_AGE = 18;
  if (age < MIN_AGE) {
    return validationMessages.dateOfBirth.minor;
  }
  
  return null;
}

/**
 * Helper: Convert DD-MM-YYYY to ISO format (YYYY-MM-DD)
 * Simple conversion - validation already done by isDigitsDatePlausible
 */
function convertDutchToISO(ddmmyyyy: string): string | null {
  const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = ddmmyyyy.match(datePattern);
  
  if (match === null) {
    return null;
  }
  
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}