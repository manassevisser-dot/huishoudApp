import { z } from 'zod';

const MemberSchema = z.object({
  fieldId: z.string(),
  name: z.string().default(''),
  dob: z.string().optional(),
  categories: z.object({
    geen: z.boolean().default(false),
    werk: z.boolean().default(false),
    uitkering: z.boolean().default(false),
    anders: z.boolean().default(false),
  }).default({
    geen: false,
    werk: false,
    uitkering: false,
    anders: false
  }),
  nettoSalaris: z.number().default(0),
});

export const HouseholdSchema = z.object({
  members: z.array(MemberSchema).default([]),
  huurtoeslag: z.number().default(0),
  zorgtoeslag: z.number().default(0),
}).default({
  members: [],
  huurtoeslag: 0,
  zorgtoeslag: 0
});