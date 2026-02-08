// src/state/schemas/zInitialTemplate.ts
import { z } from 'zod';
import { SetupSchema } from './sections/setup.schema';
import { HouseholdSchema } from './sections/household.schema';
import { FinanceSchema } from './sections/finance.schema';
import { initialFormState } from '@app/context/initialFormState';

export const FormStateSchema = z.object({
  schemaVersion: z.literal('1.0'),
  activeStep: z.string(),
  currentPageId: z.string(),
  isValid: z.boolean().default(true),

  data: z.object({
    setup: SetupSchema,
    household: HouseholdSchema,
    finance: FinanceSchema,
  }),

  meta: z.object({
    lastModified: z.string(),
    version: z.number().default(1),
  }),
}).passthrough();

export type FormState = z.infer<typeof FormStateSchema>;

// Pak getypeerde baseline uit de huidige initiële state (via unknown om TS-overlapruis te dempen)
const baseHousehold: FormState['data']['household'] =
  ((initialFormState as unknown as FormState).data?.household) as FormState['data']['household'];

const _initialFormState: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentPageId: 'landing',
  isValid: true,
  data: {
    setup: {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: 'Geen',
      heeftHuisdieren: false,
      woningType: 'Huur',
    },

    household: {
      ...baseHousehold,
      members: [],
      huurtoeslag: 0,
      zorgtoeslag: 0,
    },

    finance: {
      income: { items: [] },
      expenses: {
        items: [],
        living_costs: 0,
        energy_costs: 0,
        insurance_total: 0,
      },
    },
  },
  meta: {
    lastModified: new Date().toISOString(),
    version: 1,
  },
};