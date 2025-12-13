// src/types/household.ts
export type Member = {
  id: string;
  memberType: 'adult' | 'child';
  naam?: string;
  leeftijd?: number; // COMPUTED: Age calculated from dateOfBirth, kept for backward compatibility
  dateOfBirth?: string; // CANONICAL: ISO YYYY-MM-DD format (e.g., "1985-03-15")
  gender?: 'man' | 'vrouw' | 'anders' | 'n.v.t.';
  geboorteDatum?: string; // DEPRECATED: Use dateOfBirth instead, kept temporarily for migration
};

export type BurgerlijkeStaat =
  | 'Gehuwd'
  | 'Fiscaal Partners'
  | 'Samenwonend'
  | 'Bevriend'
  | 'Anders'
  | 'Alleenstaand';

export type WoningType = 'Koop' | 'Huur' | 'Kamer' | 'Anders';
export type HuisdierenYesNo = 'Ja' | 'Nee';
export type AutoCount = 'Nee' | 'Één' | 'Twee';