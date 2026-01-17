// src/domain/types.ts

/* =========================
 * BASIC ENUMS & LITERALS
 * ========================= */

export type MemberType = 'adult' | 'teenager' | 'child' | 'senior';

/* =========================
 * LAAG A: LOKALE DATA (UX)
 * Bevat PII (Personal Identifiable Information)
 * ========================= */

export interface Member {
  entityId: string; // Unieke ID binnen de app (bijv. UUID of 'mem_0')
  fieldId: string; // ID voor UI-binding (formulier-velden)
  memberType: MemberType;
  firstName: string;
  lastName: string;
  age?: number;
  dateOfBirth?: string; // ISO string (YYYY-MM-DD)
  finance?: {
    incomeItems?: any[];
    expenseItems?: any[];
  };
  [key: string]: unknown; // Voor toekomstige uitbreidingen
}

/* =========================
 * LAAG B: RESEARCH DATA (ANONIEM)
 * Bevat GEEN PII, alleen statistische waarden
 * ========================= */

export interface ResearchPayload {
  researchId: string; // Gepseudonimiseerd (niet herleidbaar naar persoon)
  memberType: MemberType;
  age: number;
  amount: number; // Bedrag in CENTEN
  category: string; // Geanonimiseerde categorie (bijv. 'Wonen')
  timestamp: string; // Wanneer de data is gegenereerd
}

/* =========================
 * INPUT DATA (UI / CSV)
 * De "ruwe" data zoals die binnenkomt
 * ========================= */

export interface RawUIData {
  id?: string;
  fieldId?: string;
  memberType?: string;
  type?: string; // Alias voor memberType
  fullName?: string; // Wordt gesplitst door privacyHelpers
  firstName?: string;
  lastName?: string;
  age?: unknown;
  leeftijd?: unknown; // NL fallback
  amount?: unknown; // Kan string zijn ("1250,50") of number
  category?: string;
  finance?: Record<string, unknown>;
}

/* =========================
 * FINANCIËLE STRUCTUREN
 * Voor de Rekenkamer (DataOrchestrator)
 * ========================= */

export interface FinancialIncomeSummary {
  finalIncome: number; // Bedrag in centen
  source: 'CSV' | 'Setup';
  isDiscrepancy: boolean;
  diff: number; // Het verschil tussen CSV en handmatige opgave
}

export interface SetupData {
  maandelijksInkomen?: number;
  housingIncluded?: boolean;
}

// Voeg ook CsvItem toe als die nog ontbreekt:
export interface CsvItem {
  amount: number;
  description: string;
  original: Record<string, unknown>;
  date: string; // Verwijder het vraagteken: moet verplicht een string zijn
  category?: string;
}
