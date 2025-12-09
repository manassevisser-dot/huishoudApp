export type Member = {
  id: string;
  memberType: 'adult' | 'child';
  naam?: string;
  leeftijd?: number;
  gender?: 'man' | 'vrouw' | 'anders' | 'geen antwoord';
  geboortejaar?: number;
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
