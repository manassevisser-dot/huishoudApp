// src/state/schemas/sections/setup.schema.ts
import { z } from 'zod';
import { FIELD_CONSTRAINTS_REGISTRY } from '@domain/rules/fieldConstraints';
import { generateSchemaFromConstraint } from '@state/schemas/helpers/schemaHelpers';

/**
 * SETUP SCHEMA
 * 
 * ⚠️ CRITICAL: Dit schema is GEGENEREERD uit domain constraints (SSOT)
 * ⚠️ Domain constraints in fieldConstraints.ts blijven de single source of truth
 * ⚠️ Min/max/required worden NIET hier gedefinieerd maar komen uit constraints
 * 
 * ADR-01 Enforcement: Adapter layer is de ENIGE plaats waar Zod is gebruikt
 * ADR-03 Enforcement: Domain rules leven in @domain/rules/fieldConstraints.ts
 */

// Generate schemas from constraints
const aantalMensenSchema = generateSchemaFromConstraint(
  FIELD_CONSTRAINTS_REGISTRY.aantalMensen
) as z.ZodNumber;

const aantalVolwassenSchema = generateSchemaFromConstraint(
  FIELD_CONSTRAINTS_REGISTRY.aantalVolwassen
) as z.ZodNumber;

const autoCountSchema = generateSchemaFromConstraint(
  FIELD_CONSTRAINTS_REGISTRY.autoCount
);

const heeftHuisdierenSchema = generateSchemaFromConstraint(
  FIELD_CONSTRAINTS_REGISTRY.heeftHuisdieren
) as z.ZodOptional<z.ZodBoolean>;

const woningTypeSchema = generateSchemaFromConstraint(
  FIELD_CONSTRAINTS_REGISTRY.woningType
);

/**
 * Complete Setup Schema
 * 
 * Defaults worden hier gezet (presentatie laag)
 * Constraints komen uit domain laag
 */
export const SetupSchema = z.object({
  aantalMensen: aantalMensenSchema.default(1),
  aantalVolwassen: aantalVolwassenSchema.default(1),
  autoCount: autoCountSchema.default('Geen'),
  heeftHuisdieren: heeftHuisdierenSchema.default(false),
  woningType: woningTypeSchema.default('Huur'),
}).default({
  aantalMensen: 1,
  aantalVolwassen: 1,
  autoCount: 'Geen',
  heeftHuisdieren: false,
  woningType: 'Huur'
});

// Type inference voor TypeScript
export type Setup = z.infer<typeof SetupSchema>;