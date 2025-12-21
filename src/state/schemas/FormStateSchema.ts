// WAI-005A — Zod State-Freeze (v1.0)
import { z } from 'zod';

// --- Primitives ---
// ADR-15: Minor units (integers) & ADR-16: Non-negative
export const Cents = z.number().int().nonnegative();
export const Id = z.string().min(1);

// --- C1: Huishouden ---
// Gekozen voor Optie B: velden verplicht binnen object, object zelf is partial
export const C1Schema = z
  .object({
    aantalMensen: z.number().int().min(1),
    aantalVolwassen: z.number().int().min(1),
  })
  .partial();

// --- C4: Leden ---
// MemberSchema bevat PII (naam/datum) - uitsluitend voor intern gebruik (niet voor export)
export const MemberSchema = z.object({
  id: Id.optional(),
  memberType: z.enum(['adult', 'child']),
  naam: z.string().optional(),
  leeftijd: z.number().int().nonnegative().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

export const C4Schema = z.object({
  leden: z.array(MemberSchema).default([]),
});

// --- C7/C10: Inkomsten/Lasten (centen) ---
export const MoneyItemSchema = z.object({
  id: Id,
  amount: Cents,
});

// Geen .partial() meer: items array is leidend
export const C7Schema = z.object({
  items: z.array(MoneyItemSchema).default([]),
});

export const C10Schema = z.object({
  items: z.array(MoneyItemSchema).default([]),
});

// --- FormState v1.0 ---
export const FormStateSchema = z
  .object({
    schemaVersion: z.literal('1.0'),
    C1: C1Schema.optional(),
    C4: C4Schema.optional(),
    C7: C7Schema.optional(),
    C10: C10Schema.optional(),
    isSpecialStatus: z.boolean().optional(),
    userId: z.string().nullable().optional(),
  })
  .passthrough(); // Bewust voor backwards-compat tijdens migratie

export type FormStateV1 = z.infer<typeof FormStateSchema>;
