// src/adapters/research/ResearchValidator.ts
/**
 * Valideert en transformeert ruwe onderzoeksdata naar strikte Research-contracttypes.
 *
 * @module adapters/validation
 * @see {@link ./README.md | Validation Layer - Details}
 *
 * @remarks
 * Bedragen worden gevalideerd als gehele getallen (centen) via `MoneySchema`
 * om afrondingsfouten in onderzoeksdata te voorkomen.
 * Age-constraints komen uit `FIELD_CONSTRAINTS_REGISTRY` (domein-SSOT).
 */

import { z } from 'zod';
import type { AnonymizedResearchPayload, ResearchMember, Money, ResearchContract } from '@core/types/research';
import { FIELD_CONSTRAINTS_REGISTRY as REG } from '@domain/rules/fieldConstraints';
import { isSpecialInvestigationRequired } from '@domain/rules/householdRules';

/**
 * Valideert een geldbedrag als geheel getal in centen en EUR-valuta.
 *
 * @throws {ZodError} Als `amount` geen integer is of `currency` niet `'EUR'`
 *
 * @example
 * MoneySchema.parse({ amount: 1250, currency: 'EUR' });
 */
export const MoneySchema = z.object({
  amount: z.number().int({ message: "Bedrag moet in hele centen (integers) zijn" }),
  currency: z.literal('EUR'),
});

/**
 * Valideert een geanonimiseerde onderzoek-payload.
 *
 * @remarks
 * `age` wordt begrensd door `REG.age.min` / `REG.age.max` uit `FIELD_CONSTRAINTS_REGISTRY`.
 *
 * @throws {ZodError} Bij ontbrekende of ongeldige velden
 *
 * @example
 * ResearchPayloadSchema.parse({ researchId: 'res_001', memberType: 'adult', ... });
 */
export const ResearchPayloadSchema = z.object({
  researchId: z.string().startsWith('res_'),
  memberType: z.enum(['adult', 'child', 'teenager', 'senior', 'puber']),
  age: z.number().min(REG.age.min).max(REG.age.max),
  amount: z.number(),
  category: z.string(),
  timestamp: z.string().datetime(),
});

/**
 * Validatie- en mapping-service voor onderzoekscontracten.
 *
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const ResearchValidator = {
  /**
   * Parsed en valideert een onbekende waarde als `Money`.
   *
   * @param data - Onbekende input van buiten de adapter-grens
   * @returns Geldige `Money`
   * @throws {ZodError} Bij ongeldige input
   */
  validateMoney: (data: unknown): Money => MoneySchema.parse(data),

  /**
   * Parsed en valideert een onbekende waarde als `AnonymizedResearchPayload`.
   *
   * @param data - Onbekende input van buiten de adapter-grens
   * @returns Geldige `AnonymizedResearchPayload`
   * @throws {ZodError} Bij ongeldige input
   */
  validatePayload: (data: unknown): AnonymizedResearchPayload => ResearchPayloadSchema.parse(data),

  /**
   * Mapt basisvelden en leden naar een `ResearchContract`.
   * `isSpecialStatus` wordt bepaald via `isSpecialInvestigationRequired` op basis van het aantal volwassen leden.
   *
   * @param id - Intern contract-ID
   * @param externalId - Extern referentie-ID
   * @param members - Lijst van onderzoeksleden
   * @returns Compleet `ResearchContract`
   *
   * @example
   * ResearchValidator.mapToContract('c_1', 'ext_42', members);
   */
  mapToContract: (id: string, externalId: string, members: ResearchMember[]): ResearchContract => ({
    id,
    externalId,
    isSpecialStatus: isSpecialInvestigationRequired(members.filter(m => m.memberType === 'adult').length),
    data: {
      members,
    },
  }),
};