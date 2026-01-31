import { z } from 'zod';
import { FIELD_CONSTRAINTS_REGISTRY } from '@domain/rules/fieldConstraints';
import type { FieldConstraint } from '@domain/rules/fieldConstraints';

/**
 * ADAPTER LAYER: Zod Schemas
 * 
 * ⚠️ CRITICAL: These schemas are GENERATED from domain constraints (SSOT)
 * ⚠️ Domain constraints in fieldConstraints.ts remain the single source of truth
 * ⚠️ This file translates domain rules into Zod runtime validation
 * 
 * ADR-01 Enforcement: Adapter layer is the ONLY place where Zod is used
 */

/**
 * Generates a Zod schema from domain constraint definition
 * 
 * @param constraint - Domain constraint definition from FIELD_CONSTRAINTS_REGISTRY
 * @returns Zod schema that enforces the constraint
 */
function generateSchemaFromConstraint(constraint: FieldConstraint): z.ZodType<unknown> {
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

  // Default: accept any value
  const schema = z.unknown();
  return constraint.required === true ? schema : schema.optional();
}

/**
 * Helper: Generate number schema with min/max constraints
 */
function generateNumberSchema(constraint: FieldConstraint): z.ZodType<unknown> {
  let numSchema = z.number();

  // Apply min/max constraints
  if (constraint.min !== undefined) {
    numSchema = numSchema.min(constraint.min);
  }
  if (constraint.max !== undefined) {
    numSchema = numSchema.max(constraint.max);
  }

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

  let enumSchema: z.ZodType<unknown>;
  
  if (values.length === 1) {
    enumSchema = z.literal(values[0]);
  } else {
    const [first, second, ...rest] = values;
    enumSchema = z.enum([first, second, ...rest] as [string, string, ...string[]]);
  }

  // Apply required constraint
  return constraint.required === true ? enumSchema : enumSchema.optional();
}

/**
 * Field Schemas (generated from domain constraints)
 * 
 * These are generated at module load time from FIELD_CONSTRAINTS_REGISTRY
 * to ensure they stay in sync with domain rules.
 */
export const FieldSchemas: Record<string, z.ZodType<unknown>> = Object.fromEntries(
  Object.entries(FIELD_CONSTRAINTS_REGISTRY).map(([fieldId, constraint]) => [
    fieldId,
    generateSchemaFromConstraint(constraint),
  ])
);

/**
 * Setup section schema (generated from domain constraints)
 */
export const SetupSchema = z.object({
  aantalMensen: FieldSchemas.aantalMensen ?? z.number(),
  aantalVolwassen: FieldSchemas.aantalVolwassen ?? z.number(),
  autoCount: FieldSchemas.autoCount ?? z.enum(['Geen', 'Een', 'Twee']),
  // Add other setup fields as they're added to FIELD_CONSTRAINTS_REGISTRY
}).passthrough(); // Allow additional fields not yet in registry

/**
 * Household section schema
 */
export const HouseholdSchema = z.object({
  members: z.array(z.object({}).passthrough()),
}).passthrough();

/**
 * Finance section schema
 */
export const FinanceSchema = z.object({
  income: z.object({
    items: z.array(z.object({}).passthrough()),
    totalAmount: z.number().optional(),
  }),
  expenses: z.object({
    items: z.array(z.object({}).passthrough()),
    totalAmount: z.number().optional(),
  }),
}).passthrough();

/**
 * Complete FormState schema (generated from domain constraints)
 * 
 * NOTE: This schema is DERIVED from domain constraints.
 * Changes to validation rules should be made in domain/rules/fieldConstraints.ts
 */
export const FormStateSchema = z.object({
  schemaVersion: z.literal('1.0'),
  activeStep: z.string(),
  currentPageId: z.string(),
  isValid: z.boolean(),
  data: z.object({
    setup: SetupSchema,
    household: HouseholdSchema,
    finance: FinanceSchema,
  }),
  meta: z.object({
    lastModified: z.string(),
    version: z.number(),
  }),
});

export type ValidatedFormState = z.infer<typeof FormStateSchema>;

/**
 * Parse and validate complete FormState
 * 
 * @param input - Unknown input to validate
 * @returns Validated FormState
 * @throws ZodError if validation fails
 */
export function parseFormState(input: unknown): ValidatedFormState {
  return FormStateSchema.parse(input);
}