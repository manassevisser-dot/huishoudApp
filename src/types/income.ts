export type IncomeFrequency = 'week' | '4wk' | 'month' | 'quarter' | 'year';

// DUO removed from here
export type UitkeringKey =
  | 'Bijstand' | 'WW' | 'ZW' | 'WAO' | 'WGA' | 'WIA' | 'IVA' | 'WAJONG'
  | 'Pensioen' | 'AOW' | 'IOW' | 'anders';

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
  DUO: boolean; // Added DUO
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
  vakantiegeldPerMaand?: number; // This will be deprecated in logic.
  uitkeringen?: Partial<Record<UitkeringKey, UitkeringEntry>>;
  anders?: AndersEntry[];
  duo?: { // Added duo object
    basisbeurs?: number;
    lening?: number;
  };
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
