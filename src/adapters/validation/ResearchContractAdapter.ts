// src/adapters/research/ResearchValidator.ts
/**
 * @file_intent Valideert en transformeert data voor onderzoeksdoeleinden en contractvorming.
 * @repo_architecture Mobile Industry (MI) - Research & Analytics Adapter Layer.
 * @term_definition ResearchPayload = Geanonimiseerde dataset voor externe analyse. SpecialStatus = Vlag die aangeeft of een dossier extra onderzoek behoeft op basis van de huishoudsamenstelling.
 * @contract Vertaalt ruwe data naar strikte Research types. Dwingt het gebruik van centen (integers) af voor geldbedragen via MoneySchema en koppelt domein-regels (zoals age constraints) aan de validatie.
 * @ai_instruction Deze adapter integreert direct met de householdRules uit het domein voor status-bepaling. Let op: bedragen moeten altijd als hele getallen (centen) worden aangeleverd om afrondingsfouten in onderzoek te voorkomen.
 */

import { z } from 'zod';
import type { AnonymizedResearchPayload, ResearchMember, Money, ResearchContract } from '@core/types/research';
import { FIELD_CONSTRAINTS_REGISTRY as REG } from '@domain/rules/fieldConstraints';
import { isSpecialInvestigationRequired } from '@domain/rules/householdRules';

/**
 * RESEARCH CONTRACT ADAPTER
 */

export const MoneySchema = z.object({
  amount: z.number().int({ message: "Bedrag moet in hele centen (integers) zijn" }),
  currency: z.literal('EUR'),
});

export const ResearchPayloadSchema = z.object({
  researchId: z.string().startsWith('res_'),
  memberType: z.enum(['adult', 'child', 'teenager', 'senior', 'puber']),
  age: z.number().min(REG.age.min).max(REG.age.max),
  amount: z.number(),
  category: z.string(),
  timestamp: z.string().datetime(),
});

export const ResearchValidator = {
  validateMoney: (data: unknown): Money => MoneySchema.parse(data),
  validatePayload: (data: unknown): AnonymizedResearchPayload => ResearchPayloadSchema.parse(data),
  
  mapToContract: (id: string, externalId: string, members: ResearchMember[]): ResearchContract => ({
    id,
    externalId,
    isSpecialStatus: isSpecialInvestigationRequired(members.filter(m => m.memberType === 'adult').length),
    data: {
      members,
    },
  }),
};