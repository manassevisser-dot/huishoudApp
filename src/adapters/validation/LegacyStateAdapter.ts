/**
 * Tolerante validator voor legacy data structuren.
 * 
 * @module adapters/validation
 * @see {@link ./README.md | Legacy Validator - Details}
 * 
 * @remarks
 * - Gebruikt `filteredArray` om corrupte items te negeren i.p.v. hele parse te laten falen
 * - Schema's zijn losser dan strikte validatie voor achterwaartse compatibiliteit
 */

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

/**
 * Filtert array naar alleen valide items volgens gegeven schema.
 * 
 * @param itemSchema - Zod schema voor individuele items
 * @returns Preprocessed array met alleen valide items
 * 
 * @example
 * const validMembers = filteredArray(legacyMemberSchema)(malformedArray);
 */
const filteredArray = (itemSchema: z.ZodTypeAny) => 
  z.preprocess((val): unknown[] => { 
    if (!Array.isArray(val)) return [];
    
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

/**
 * Parse en valideer legacy data naar gegarandeerd geldige structuur.
 * 
 * @param data - Onbekende input van legacy bron of externe import
 * @returns Gegarandeerd geldige LegacyState (minimaal leeg object)
 * 
 * @example
 * const state = LegacyValidator.parseState(incomingLegacyData);
 * // state is altijd geldig, corrupte items zijn gefilterd
 */
export const LegacyValidator = {
  parseState: (data: unknown): LegacyState => {
    const result = legacyStateSchema.safeParse(data);
    return result.success ? result.data : {};
  }
};