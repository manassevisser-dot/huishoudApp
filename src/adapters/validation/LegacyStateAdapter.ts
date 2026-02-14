import { z } from 'zod';

const ZodjsonPrimitive = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const legacyMemberSchema = z.object({
  id: z.string().optional(),
  entityId: z.string().optional(),
  firstName: z.string().optional(),
  naam: z.string().optional(),
  memberType: z.string().optional(),
  type: z.string().optional(),
});

const legacyItemSchema = z.object({
  fieldId: z.string().optional(),
  amount: z.number().optional(),
}).passthrough();

const legacyStateSchema = z.object({
  setup: z.record(z.string(), ZodjsonPrimitive).optional(),
  data: z.object({
    setup: z.record(z.string(), ZodjsonPrimitive).optional(),
    household: z.object({ leden: z.array(legacyMemberSchema).optional() }).optional(),
    leden: z.array(legacyMemberSchema).optional(),
    transactions: z.array(legacyItemSchema).optional(),
    finance: z.object({
      income: z.object({ items: z.array(legacyItemSchema).optional() }).optional(),
      expenses: z.object({ items: z.array(legacyItemSchema).optional() }).optional(),
    }).optional(),
  }).optional(),
  household: z.object({ leden: z.array(legacyMemberSchema).optional() }).optional(),
  leden: z.array(legacyMemberSchema).optional(),
  transactions: z.array(legacyItemSchema).optional(),
}).passthrough();

export type LegacyState = z.infer<typeof legacyStateSchema>;
export type LegacyMember = z.infer<typeof legacyMemberSchema>;
export type LegacyItem = z.infer<typeof legacyItemSchema>;
export type ZodJsonPrimitive = z.infer<typeof ZodjsonPrimitive>;
export const LegacyValidator = {
  parseState: (data: unknown): LegacyState => {
    const result = legacyStateSchema.safeParse(data);
    return result.success ? result.data : {};
  }
};