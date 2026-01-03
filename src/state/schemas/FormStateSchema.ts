import { z } from 'zod';

// 1. Veiligheid voor geld-items (centen)
const MoneyItemSchema = z.object({
  fieldId: z.string(),
  label: z.string().optional(),
  amount: z.number().int(), 
});

// 2. Voorkomt de ".map is not a function" error door defaults
const MoneyListSchema = z
  .object({
    items: z.array(MoneyItemSchema).default([]),
  })
  .default({ items: [] });

// 3. Het volledige schema
export const FormStateSchema = z
  .object({
    schemaVersion: z.literal('1.0'),
    activeStep: z.string(),
    currentPageId: z.string(),
    isValid: z.boolean().default(true),

    data: z.object({
      setup: z.object({
        aantalMensen: z.number().default(1),
        aantalVolwassen: z.number().default(1),
        // HIER AANGEPAST: Specifieke literals in plaats van algemene string
        autoCount: z.enum(['Nee', 'Een', 'Twee']).default('Nee'),
      }).default({ aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Nee' }),

      household: z.object({
        members: z.array(z.any()).default([]),
      }).default({ members: [] }),

      finance: z.object({
        income: MoneyListSchema,
        expenses: MoneyListSchema,
      }).default({ 
        income: { items: [] }, 
        expenses: { items: [] } 
      }),
    }),

    meta: z.object({
      lastModified: z.string(),
      version: z.number().default(1),
    }),
  })
  .passthrough(); 

export type FormState = z.infer<typeof FormStateSchema>;

/**
 * 4. De initiële state. 
 * We gebruiken "as const" bij autoCount om TS te vertellen 
 * dat dit exact de waarde "Nee" is, en niet een willekeurige string.
 */
export const initialFormState: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentPageId: 'landing',
  isValid: true,
  data: {
    setup: {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: 'Nee' as const, // Forceer de specifieke waarde
    },
    household: {
      members: [],
    },
    finance: {
      income: { items: [] },
      expenses: { items: [] },
    },
  },
  meta: {
    lastModified: new Date().toISOString(),
    version: 1,
  },
};