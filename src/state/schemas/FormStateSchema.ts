import { z } from 'zod';

// 1. Individueel item (centen!)
const MoneyItemSchema = z.object({
  fieldId: z.string(),
  label: z.string().optional(),
  amount: z.number().int(), // Moet integer zijn (Phoenix-eis)
});

// 2. De lijst-structuur met harde defaults
// Dit voorkomt de ".map is not a function" error
const MoneyListSchema = z
  .object({
    items: z.array(MoneyItemSchema).default([]),
  })
  .default({ items: [] });

// 3. Het hoofd-schema
export const FormStateSchema = z
  .object({
    schemaVersion: z.string().literal('1.0'),
    isSpecialStatus: z.boolean().default(false),

    // Huishouden
    C1: z
      .object({
        aantalMensen: z.number().default(1),
        aantalVolwassen: z.number().default(1),
      })
      .default({ aantalMensen: 1, aantalVolwassen: 1 }),

    // Leden (Privacy-proof)
    C4: z
      .object({
        leden: z
          .array(
            z.object({
  fieldId: z.string(),
              memberType: z.string(),
              leeftijd: z.number().optional(),
              gender: z.string().optional(),
            }),
          )
          .default([]),
      })
      .default({ leden: [] }),

    // Financiën (Hier gaat het vaak mis bij de .map)
    C7: MoneyListSchema, // Inkomsten
    C10: MoneyListSchema, // Lasten
  })
  .passthrough(); // Staat extra velden toe zonder te crashen

export type FormStateV1 = z.infer<typeof FormStateSchema>;
