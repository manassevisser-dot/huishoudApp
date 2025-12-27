export type IncomeFrequency = 'week' | '4wk' | 'month' | 'quarter' | 'year';

export type UitkeringKey =
  | 'DUO'
  | 'Bijstand'
  | 'WW'
  | 'ZW'
  | 'WAO'
  | 'WGA'
  | 'WIA'
  | 'IVA'
  | 'WAJONG'
  | 'Pensioen'
  | 'AOW'
  | 'IOW'
  | 'anders';

export type UitkeringEntry = {
  enabled: boolean;
  amount?: number;
  frequentie?: IncomeFrequency;
  omschrijving?: string;
};

export type AndersEntry = {
  id: string;
  label?: string;
  amount?: number;
  frequentie?: IncomeFrequency;
};

export type IncomeCategories = {
  geen: boolean;
  werk: boolean;
  uitkering: boolean;
  anders: boolean;
};

export type IncomeMember = {
  id: string;
  categories: IncomeCategories;
  nettoSalaris?: number;
  frequentie?: IncomeFrequency;
  toeslagen?: {
    zorgtoeslag?: number;
    overige?: number;
    reiskosten?: number;
  };
  vakantiegeldPerJaar?: number;
  vakantiegeldPerMaand?: number;
  uitkeringen?: Partial<Record<UitkeringKey, UitkeringEntry>>;
  anders?: AndersEntry[];
};

export type HouseholdBenefits = {
  huurtoeslag?: number;
  kindgebondenBudget?: number;
  kinderopvangtoeslag?: number;
  kinderbijslag?: number;
};

export type VermogenData = {
  hasVermogen: boolean;
  waarde?: number;
};
