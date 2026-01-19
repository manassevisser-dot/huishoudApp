import { z } from 'zod';
import { FormStateSchema } from '@state/schemas/FormStateSchema';
import { isDigitsDatePlausible } from '@domain/validation/dateValidators';
import { parseDDMMYYYYtoISO } from '@domain/helpers/DateHydrator';
import { formatDutchValue } from '@domain/helpers/numbers';

/**
 * PHOENIX VALIDATOR (SVZ-2-Q)
 * Volledig Type-safe conform Sam's contract en Gate-E eisen.
 */
export function validateField(fieldPath: string, value: unknown, fullState?: any): string[] {
  const errors: string[] = [];

  try {
    const fieldSchema = extractFieldSchema(FormStateSchema, fieldPath);
    
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      if (!result.success) {
        // Fix: Gebruik result.error.issues voor betere type-compatibiliteit
        errors.push(...result.error.issues.map((issue: z.ZodIssue) => issue.message));
      }
    }

    // Legacy Cross-field Validation
    if (fieldPath.includes('members') && fullState) {
       const expected = Number(fullState.data?.setup?.aantalMensen ?? 0);
       if (Array.isArray(value) && value.length !== expected) {
         errors.push(`Aantal leden (${value.length}) moet gelijk zijn aan totaal aantal (${expected}).`);
       }
    }

    return errors;
  } catch {
    // Fix: Verwijder ongebruikte 'err' voor de linter
    return ['Validatie error'];
  }
}

export function validateDobNL(input: string): string | null {
  const raw = input ?? '';
  const digits = formatDutchValue(raw);

  if (digits.length < 8) return 'Vul een volledige datum in (DD-MM-YYYY).';
  if (!isDigitsDatePlausible(digits)) return 'Ongeldige datum.';

  const display = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
  if (!parseDDMMYYYYtoISO(display)) return 'Datum bestaat niet.';
  
  return null;
}

/**
 * Veilige schema-extractie die rekening houdt met ZodObject en ZodEffects (zoals .refine)
 */
function extractFieldSchema(schema: z.ZodTypeAny, path: string): z.ZodTypeAny | null {
  const parts = path.split('.');
  let current: any = schema;

  for (const part of parts) {
    // UNWRAP: Haal het echte schema uit Effects, Optional, Default, etc.
    while (current && current._def && (current._def.schema || current._def.innerType)) {
      current = current._def.schema || current._def.innerType;
    }

    if (current instanceof z.ZodObject) {
      current = current.shape[part];
    } else {
      console.warn(`[Validator] Pad deel "${part}" niet gevonden in schema voor pad "${path}"`);
      return null;
    }
  }
  return current;
}
