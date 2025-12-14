// src/types/household.ts
// household.ts

// Optioneel maar beter: Creëer een type alias
export type Gender = 'man' | 'vrouw' | 'anders' | 'n.v.t.';

// Essentieel: Definieer en exporteer de constante array van WAARDEN
export const GENDER_OPTIONS: Gender[] = ['man', 'vrouw', 'anders', 'n.v.t.'];

// Pas de Member type aan om het type alias te gebruiken (houdt de structuur schoon)
export type Member = {
  id: string;
  memberType: 'adult' | 'child';
  naam?: string;
  leeftijd?: number; 
  dateOfBirth?: string; 
  gender?: Gender; // Gebruikt nu het geëxporteerde type
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