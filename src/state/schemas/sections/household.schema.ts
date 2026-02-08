import { z } from 'zod';
import { FIELD_CONSTRAINTS_REGISTRY } from '@domain/rules/fieldConstraints';
import { generateSchemaFromConstraint } from '@state/schemas/helpers/schemaHelpers';

/**
 * MEMBER SCHEMA
 */
const MemberSchema = z.object({
  fieldId: z.string(),
  name: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.name).default(''),
  dob: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.dob),
  age: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.age),
  gender: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.gender),
  categories: z.object({
    geen: z.boolean().default(false),
    werk: z.boolean().default(false),
    uitkering: z.boolean().default(false),
    anders: z.boolean().default(false),
  }).default({
    geen: false, werk: false, uitkering: false, anders: false
  }),
  nettoSalaris: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.nettoSalaris),
  frequentie: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.frequentie),
  vakantiegeldPerJaar: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.vakantiegeldPerMaand),
  uitkeringType: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.uitkeringType),
  uitkeringBedrag: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.uitkeringBedrag),
  ziektekostenPremie: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.ziektekostenPremie),
  telefoon: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.telefoon),
  ov: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.ov),
}).passthrough();

/**
 * HOUSEHOLD SCHEMA
 */
export const HouseholdSchema = z.object({
  members: z.array(MemberSchema).default([]),
  burgerlijkeStaat: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.burgerlijkeStaat),
  huurtoeslag: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.huurtoeslag).default(0),
  zorgtoeslag: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.zorgtoeslag).default(0),
  kindgebondenBudget: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.kindgebondenBudget),
  kinderopvangtoeslag: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.kinderopvangtoeslag),
  kinderbijslag: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.kinderbijslag),
  heeftVermogen: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.heeftVermogen),
  vermogenWaarde: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.vermogenWaarde),
})
.passthrough() // Eerst passthrough!
.default({     // Dan pas default!
  members: [],
  huurtoeslag: 0,
  zorgtoeslag: 0,
  burgerlijkeStaat: '',
  kindgebondenBudget: 0,
  kinderopvangtoeslag: 0,
  kinderbijslag: 0,
  heeftVermogen: false,
  vermogenWaarde: 0
});

export type Household = z.infer<typeof HouseholdSchema>;
export type Member = z.infer<typeof MemberSchema>;