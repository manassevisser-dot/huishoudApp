import { z } from 'zod';

const MoneyItemSchema = z.object({
  fieldId: z.string(),
  label: z.string().optional(),
  amount: z.number().default(0),
});

export const FinanceSchema = z.object({
  income: z.object({ 
    items: z.array(MoneyItemSchema).default([]) 
  }).default({ items: [] }),
  expenses: z.object({
    items: z.array(MoneyItemSchema).default([]),
    living_costs: z.number().default(0),
    energy_costs: z.number().default(0),
    insurance_total: z.number().default(0),
  }).default({
    items: [],
    living_costs: 0,
    energy_costs: 0,
    insurance_total: 0
  }),
}).default({
  income: { items: [] },
  expenses: { items: [], living_costs: 0, energy_costs: 0, insurance_total: 0 }
});