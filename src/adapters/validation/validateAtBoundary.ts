import { ZodError } from 'zod';
import { FieldSchemas } from './formStateSchema';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';

/**
 * ADAPTER LAYER: Boundary Validation
 * 
 * This is the SINGLE point where external input enters the system.
 * All input is validated and normalized here before reaching the domain.
 * 
 * ADR-01 Enforcement: This adapter is the only boundary between UI and domain
 * ADR-02 Enforcement: Type safety enforced via Zod at runtime
 */

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Validates and normalizes input at the system boundary
 * 
 * This function:
 * 1. Finds the appropriate Zod schema for the field
 * 2. Validates the input value
 * 3. Normalizes the value (coercion, trimming, etc.)
 * 4. Returns parsed value or error message
 * 
 * @pure function - no side effects
 * @param fieldId - Field identifier
 * @param value - Raw input value (from UI)
 * @returns ValidationResult with parsed data or error
 * 
 * @example
 * // Success case
 * validateAtBoundary('aantalMensen', '5')
 * // → { success: true, data: 5 }
 * 
 * // Error case
 * validateAtBoundary('aantalMensen', 'invalid')
 * // → { success: false, error: 'Waarde moet een getal zijn.' }
 */
export function validateAtBoundary<T = unknown>(
  fieldId: string,
  value: unknown
): ValidationResult<T> {
  // Find schema for this field
  const schema = FieldSchemas[fieldId];

  // If no schema exists, field is unknown - pass through with warning
  if (schema === undefined) {
    Logger.warn('BOUNDARY_NO_SCHEMA', { fieldId, value });
    return { success: true, data: value as T };
  }

  // Validate with Zod schema
  try {
    const parsed = schema.parse(value);
    return { success: true, data: parsed as T };
  } catch (error) {
    return handleValidationError(error, fieldId, value);
  }
}

/**
 * Helper: Handle validation errors with proper logging
 */
function handleValidationError(
  error: unknown,
  fieldId: string,
  value: unknown
): ValidationResult<never> {
  // Extract user-friendly error message from ZodError
  if (error instanceof ZodError) {
    const errorMessage = extractZodErrorMessage(error);
    
    // Log validation failure
    Logger.warn('BOUNDARY_VALIDATION_FAILED', {
      fieldId,
      value,
      error: errorMessage,
      issues: error.issues
    });
    
    return { success: false, error: errorMessage };
  }

  // Unexpected error - route to ticketing
  Logger.error('BOUNDARY_UNEXPECTED_ERROR', {
    fieldId,
    value,
    error
  });
  
  return { success: false, error: 'Onverwachte validatie fout' };
}

/**
 * Helper: Extract user-friendly error message from ZodError
 */
function extractZodErrorMessage(zodError: ZodError): string {
  const firstIssue = zodError.issues[0];
  if (firstIssue === undefined) {
    return 'Validatie fout';
  }
  return firstIssue.message;
}

/**
 * Validates and normalizes multiple fields at once
 * 
 * @param fields - Record of fieldId → value pairs
 * @returns ValidationResult with all parsed fields or first error
 */
export function validateAtBoundaryBatch(
  fields: Record<string, unknown>
): ValidationResult<Record<string, unknown>> {
  const parsed: Record<string, unknown> = {};
  
  for (const [fieldId, value] of Object.entries(fields)) {
    const result = validateAtBoundary(fieldId, value);
    
    if (!result.success) {
      return { success: false, error: `${fieldId}: ${result.error}` };
    }
    
    parsed[fieldId] = result.data;
  }
  
  return { success: true, data: parsed };
}

/**
 * Safe parse: returns undefined on error instead of throwing
 * 
 * @param fieldId - Field identifier
 * @param value - Raw input value
 * @returns Parsed value or undefined
 */
export function safeParseAtBoundary<T = unknown>(
  fieldId: string,
  value: unknown
): T | undefined {
  const result = validateAtBoundary<T>(fieldId, value);
  return result.success ? result.data : undefined;
}