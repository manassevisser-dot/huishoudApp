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


// Helper om een array te valideren waarbij foute items geruisloos worden verwijderd
const filteredArray = (itemSchema: z.ZodTypeAny) => 
  z.preprocess((val): unknown[] => { // <--- Voeg : unknown[] return type toe
    if (!Array.isArray(val)) return [];
    
    // Filter de items en cast het resultaat naar unknown[] voor ESLint
    return (val as unknown[]).filter((item) => {
      const p = itemSchema.safeParse(item);
      return p.success;
    });
  }, z.array(itemSchema)).catch([]);

const legacyStateSchema = z.object({
  setup: z.record(z.string(), ZodjsonPrimitive).optional(),
  data: z.object({
    setup: z.record(z.string(), ZodjsonPrimitive).optional(),
    household: z.object({ 
      leden: filteredArray(legacyMemberSchema) 
    }).optional(),
    leden: filteredArray(legacyMemberSchema).optional(),
    transactions: filteredArray(legacyItemSchema).optional(),
    finance: z.object({
      income: z.object({ 
        items: filteredArray(legacyItemSchema) 
      }).optional(),
      expenses: z.object({ 
        items: filteredArray(legacyItemSchema) 
      }).optional(),
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