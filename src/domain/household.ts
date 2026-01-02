/**
 * MemberType: De kern-variabele voor ons data-onderzoek.
 * Definieert de rol binnen het huishouden.
 */
export type MemberType = 'adult' | 'child' | 'teenager' | 'senior';

export interface Member {
  // --- Identifiers ---
  entityId: string;    // Unieke database sleutel (UUID)
  fieldId: string;     // Unieke UI sleutel (voor Phoenix Forms state)

  // --- Core Data ---
  memberType: MemberType;
  
  // ✅ NIEUWE STANDAARD (Split Name)
  firstName: string;
  lastName: string;

  // --- Optionele Data ---
  dateOfBirth?: string; // ISO string (YYYY-MM-DD)
  gender?: string;
  
  // --- Derived / Computed (mag optioneel zijn) ---
  age?: number;

  // ❌ LEGACY (Verwijderd om refactor af te dwingen)
}

export interface Household {
  householdId: string;
  members: Member[];
  lastUpdated: string;
}