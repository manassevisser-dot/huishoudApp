// Voeg deze toe bovenaan of bij de andere exports
export type WoningType = 'Huur' | 'Koop' | 'Inwonend' | 'Dakloos'; // Vul aan waar nodig


export interface Member {
  id: string;
  memberType: string;
  naam?: string;      // 👈 Toegevoegd om IncomeRepeater te fixen
  leeftijd?: number;
  gender?: string;
  dateOfBirth?: string;
}

// ... rest van je file

export type FieldOption = { label: string; value: string };

export type ConditionalConfig = {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '===' | '!==';
  value: any;
};

export type FieldConfig = {
  id: string;
  label: string;
  type:
    | 'text'
    | 'numeric'
    | 'radio-chips'
    | 'toggle'
    | 'counter'
    | 'repeater-array'
    | 'income-repeater'
    | 'expense-repeater';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: {
    min?: number;
    max?: number;
    postcode?: boolean;
    lengthEqualsTo?: string;
  };
  options?: FieldOption[];
  conditional?: ConditionalConfig;
};

export type PageConfig = {
  id: string;
  title: string;
  fields: FieldConfig[];
};

export interface Member {
  id: string;
  memberType: string;
  leeftijd?: number;
  gender?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  label?: string;
}

export interface FormState {
  schemaVersion: string;
  isSpecialStatus: boolean;
  C1: { aantalMensen: number; aantalVolwassen: number };
  C4: { 
    leden: Member[]; 
    woning?: string;      // Teruggezet voor WizardPage
    autoCount?: string;   // Teruggezet voor ExpenseRepeater
  };
  C7: { 
    items: Transaction[]; 
    inkomsten?: any;      // Teruggezet voor IncomeRepeater
    householdBenefits?: any; 
    vermogen?: any; 
  };
  C10: { items: Transaction[] };
  [key: string]: any; 
}

// Voeg dit type toe voor de dispatch errors
// Maak de actie-definitie ruim genoeg voor alle legacy patronen
export type FormAction = { 
  type: string; 
  payload?: any; 
  pageId?: string; 
  data?: any; 
  field?: string;
  value?: any;
};

export type AutoCount = 'Een' | 'Twee' | 'Nee'; // Of de waarden die jij gebruikt

export interface Member {
  id: string;
  memberType: string;
  leeftijd?: number;
  gender?: string;
}