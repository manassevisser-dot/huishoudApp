// src/core/types/research.ts
/**
 * @file_intent Definieert de data-contracten voor externe analytics, onderzoek en database-synchronisatie (zoals N8N integraties).
 * @repo_architecture Mobile Industry (MI) - Research & Integration Layer.
 * @term_definition ResearchContract = Het finale pakket inclusief 'isSpecialStatus' dat naar de database wordt gepusht. CsvItem = Een getransformeerd transactie-object verrijkt met metadata voor audit-doeleinden. AnonymizedResearchPayload = Een privacy-compliant datastructuur voor statistische analyse.
 * @contract Biedt een strikte interface voor data-export. Waar de FormState gericht is op runtime-UI, is de ResearchContract gericht op koude opslag en analyse. Het dwingt anonimisering en specifieke formaten (zoals cents voor bedragen) af om precisieverlies en privacy-lekken te voorkomen.
 * @ai_instruction Bij het implementeren van de database-push via N8N moet de `ResearchValidator.mapToContract` utility worden gebruikt om de 'isSpecialStatus' te berekenen. Let op de CONTRACT_VERSION; bij wijzigingen in de ResearchMember-structuur moet deze versie worden opgehoogd om de integriteit van de onderzoeksdataset te waarborgen.
 */

/**
 *  TODO: 
 * isSpecialStatus laten landen in de DataBase als N8N gemaakt is:
 * Voorbeeld van hoe de orchestrator de adapter aanroept voor de database-push:
 * const contract = ResearchValidator.mapToContract(
 * state.id, 
 * state.externalId, 
 * state.data.members
 * );
 * Nu bevat 'contract' de isSpecialStatus, klaar voor de database.
 * await database.save(contract);
 * */ 


export interface FinanceItem {
  id: string;
  amountCents: number;
  description?: string;
  fieldId?: string;
}

export interface FinanceBucket {
  items: FinanceItem[];
  totalAmountCents?: number;
}

export interface FinanceState {
  income: FinanceBucket;
  expenses: FinanceBucket;
}

export interface FinancialIncomeSummary {
  source: string;
  finalIncome: number;
  isDiscrepancy: boolean;
}

export interface UndoResult {
  id: string;
  amount: number;
  currency: 'EUR';
  description?: string;
  reason: string;
  timestamp: string;
  schemaVersion: string;
}

export interface Money {
  amount: number;
  currency: 'EUR';
}

export type MemberType = 'adult' | 'child' | 'teenager' | 'senior' | 'puber';

export interface ResearchMember {
  entityId: string;
  fieldId: string;
  memberType: MemberType;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  age?: number;
  [key: string]: unknown;
}

export interface CsvItem {
  id: string;
  date: string;
  description: string;
  amountCents: number;
  category?: string;
  isIgnored?: boolean;
  amount: number;
  original: Record<string, unknown>;
}
export interface ResearchContract {
  id: string;
  externalId: string;
  isSpecialStatus: boolean; 
  data: {
    members: ResearchMember[];
  };
}
export interface RawUIData {
    setup?: Record<string, unknown>;
    household?: { members: unknown[] };    
    finance?: Record<string, unknown>;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  memberType?: string;
  type?: string;
  id?: string;
  fieldId?: string;
  age?: number;
  leeftijd?: number;
  amount?: number;
  category?: string;
  [key: string]: unknown;
}

export interface AnonymizedResearchPayload {
    version?: string;
    timestamp: string;
    anonymizedData?: Record<string, unknown>;
    metadata?: {
      source: 'wizard' | 'import';
      os: string;
    };
    researchId?: string;
    memberType?: MemberType;
    age?: number;
    amount?: number;
    category?: string;
  }

export const CONTRACT_VERSION = '1.0.0';