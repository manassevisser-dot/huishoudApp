//src/core/types/research.ts

/**
 *  TODO: 
 * isSpecialStatus laten landen in de DataBase als N8N gemaakt is:
 * Voorbeeld van hoe de orchestrator de adapter aanroept voor de database-push:
 * const contract = ResearchValidator.mapToContract(
 * state.id, 
 * state.externalId, 
 * state.data.members
 * );
 *  //Nu bevat 'contract' de isSpecialStatus, klaar voor de database.
 * await database.save(contract);
 * */ 

// --- Finance ---
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

// --- Household ---
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
  [key: string]: unknown; // Voor index signature compatibiliteit in tests
}

// --- Wasstraat / Services ---
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
    setup?: Record<string, unknown>;     // Optioneel gemaakt (?)
    household?: { members: unknown[] };     // Optioneel gemaakt (?)
    finance?: Record<string, unknown>;
  // Velden die privacyHelpers direct aanroept op 'raw'
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
    // We maken de structurele velden optioneel om de wasstraat-mapping te laten slagen
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