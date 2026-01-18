
import { z } from 'zod';
import type { FormState } from '@/core/types/core';

const OpaqueObjectSchema = z.object({}).passthrough();

const MoneyListSchema = z.object({
  items: z.array(OpaqueObjectSchema),
  totalAmount: z.number().optional(),
});

export const FormStateSchema = z.object({
  schemaVersion: z.string(),
  activeStep: z.string(),
  currentPageId: z.string(),
  isValid: z.boolean(),
  data: z.object({
    setup: z
      .object({
        // Let op: juiste veldnamen
        aantalMensen: z.number(),
        aantalVolwassen: z.number(),
        autoCount: z.enum(['Nee', 'Een', 'Twee']),
        heeftHuisdieren: z.boolean().optional(),
      })
      .passthrough(), // vanwege [key: string]: unknown in jouw interface

    household: z.object({
      members: z.array(OpaqueObjectSchema),
    }),

    finance: z.object({
      income: MoneyListSchema,
      expenses: MoneyListSchema,
    }),
  }),

  meta: z.object({
    lastModified: z.string(),
    version: z.number(),
  }),
});

export type ValidatedFormState = z.infer<typeof FormStateSchema>;

// Allowed exception: (input: unknown) is expliciet toegestaan als parse‑parameter
export function parseFormState(input: unknown): ValidatedFormState {
  return FormStateSchema.parse(input);
}

// Compile‑time structural checks (types; geen runtime‑code):
type _SchemaMatchesFormState_A =
  z.infer<typeof FormStateSchema> extends FormState ? true : never;
type _SchemaMatchesFormState_B =
  FormState extends z.infer<typeof FormStateSchema> ? true : never;
