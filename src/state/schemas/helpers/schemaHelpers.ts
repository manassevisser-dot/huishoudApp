// src/state/schemas/helpers/schemaHelpers.ts
import { z } from 'zod';
import type { FieldConstraint } from '@domain/rules/fieldConstraints';

/**
 * SCHEMA HELPERS
 * 
 * Gedeelde utilities voor schema generatie uit domain constraints
 */

/**
 * Genereert een Zod enum schema uit een readonly const array
 * 
 * @example
 * const OPTIONS = ['A', 'B', 'C'] as const;
 * const schema = enumFromConst(OPTIONS); // z.enum(['A', 'B', 'C'])
 * 
 * @param arr - Readonly const array met opties
 * @returns Zod enum schema
 */
export function enumFromConst<T extends readonly string[]>(
  arr: T
): z.ZodType<unknown> {
  if (arr.length === 0) {
    return z.never();
  }
  
  if (arr.length === 1) {
    return z.literal(arr[0]);
  }
  
  // Zod v3.x compatibel: gebruik array spread
  const [first, second, ...rest] = arr;
  return z.enum([first, second, ...rest] as unknown as [string, string, ...string[]]);
}

/**
 * Genereert een Zod schema uit een domain constraint definition
 * 
 * Dit is de SSOT→Schema bridge: domain rules worden vertaald naar runtime validation
 * 
 * @param constraint - Domain constraint definition from FIELD_CONSTRAINTS_REGISTRY
 * @returns Zod schema that enforces the constraint
 * 
 * @example
 * const constraint = { type: 'number', min: 1, max: 10, required: true };
 * const schema = generateSchemaFromConstraint(constraint);
 * // → z.number().min(1).max(10)
 */
export function generateSchemaFromConstraint(
  constraint: FieldConstraint | undefined
): z.ZodType<unknown> {
  // Handle undefined constraint (unknown fields pass through)
  if (constraint === undefined || Object.keys(constraint).length === 0) {
    return z.unknown();
  }

  // Generate base schema based on type
  if (constraint.type === 'number') {
    return generateNumberSchema(constraint);
  }
  
  if (constraint.type === 'enum' && constraint.values !== undefined) {
    return generateEnumSchema(constraint);
  }
  
  if (constraint.type === 'string') {
    return generateStringSchema(constraint);
  }
  
  if (constraint.type === 'boolean') {
    return generateBooleanSchema(constraint);
  }

  // Default: accept any value
  const schema = z.unknown();
  return constraint.required === true ? schema : schema.optional();
}

/**
 * Helper: Generate number schema with min/max constraints
 */
function generateNumberSchema(constraint: FieldConstraint): z.ZodType<unknown> {
  // Base number schema (no params - most compatible)
  let numSchema = z.number();

  // Apply min/max constraints
  if (constraint.min !== undefined) {
    numSchema = numSchema.min(constraint.min, {
      message: constraint.message ?? `Waarde moet minimaal ${constraint.min} zijn`,
    });
  }
  
  if (constraint.max !== undefined) {
    numSchema = numSchema.max(constraint.max, {
      message: constraint.message ?? `Waarde mag maximaal ${constraint.max} zijn`,
    });
  }

  // Note: warn threshold wordt NIET afgedwongen in schema (soft limit)
  // Deze wordt gecheckt door orchestrator via exceedsWarning()

  // Apply required constraint
  return constraint.required === true ? numSchema : numSchema.optional();
}

/**
 * Helper: Generate enum schema with allowed values
 */
function generateEnumSchema(constraint: FieldConstraint): z.ZodType<unknown> {
  const values = constraint.values;
  if (values === undefined || values.length === 0) {
    return z.never();
  }

  const enumSchema = enumFromConst(values);

  // Apply required constraint
  return constraint.required === true ? enumSchema : enumSchema.optional();
}

/**
 * Helper: Generate string schema with pattern/length constraints
 */
function generateStringSchema(constraint: FieldConstraint): z.ZodType<unknown> {
  // Base string schema (no params - most compatible)
  let strSchema = z.string();

  // Apply min/max length
  if (constraint.min !== undefined) {
    strSchema = strSchema.min(constraint.min, {
      message: `Minimaal ${constraint.min} karakters`,
    });
  }
  
  if (constraint.max !== undefined) {
    strSchema = strSchema.max(constraint.max, {
      message: `Maximaal ${constraint.max} karakters`,
    });
  }

  // Apply regex pattern
  if (constraint.pattern !== undefined) {
    strSchema = strSchema.regex(constraint.pattern, {
      message: constraint.message ?? 'Ongeldige notatie',
    });
  }

  // Apply required constraint
  return constraint.required === true ? strSchema : strSchema.optional();
}

/**
 * Helper: Generate boolean schema
 */
function generateBooleanSchema(constraint: FieldConstraint): z.ZodType<unknown> {
  // Base boolean schema (Zod v3.x compatible)
  const boolSchema = z.boolean();

  return constraint.required === true ? boolSchema : boolSchema.optional();
}

/**
 * Genereert een optioneel enum schema met default waarde
 * 
 * @param arr - Readonly const array met opties
 * @param defaultValue - Default waarde (moet in arr voorkomen)
 * @returns Zod enum schema met default
 */
export function optionalEnumWithDefault<T extends readonly string[]>(
  arr: T,
  defaultValue: T[number]
): z.ZodDefault<z.ZodType<unknown>> {
  const enumSchema = enumFromConst(arr);
  
  // Type-safe check: all Zod schemas have .default() method
  // We use a runtime check on the schema's internal structure
  if (
    typeof enumSchema === 'object' && 
    enumSchema !== null && 
    '_def' in enumSchema
  ) {
    // Type assertion based on runtime check - safe because we verified structure
    const schemaWithDefault = enumSchema as z.ZodType<unknown>;
    return schemaWithDefault.default(defaultValue) as z.ZodDefault<z.ZodType<unknown>>;
  }
  
  throw new Error(`Cannot create optional enum with default for array: ${JSON.stringify(arr)}`);
}

/**
 * Type guard om te checken of een waarde een geldige enum waarde is
 * 
 * @param value - Waarde om te checken
 * @param arr - Readonly const array met geldige waarden
 * @returns True als value in arr zit
 */
export function isValidEnum<T extends readonly string[]>(
  value: unknown,
  arr: T
): value is T[number] {
  return typeof value === 'string' && (arr as readonly string[]).includes(value);
}