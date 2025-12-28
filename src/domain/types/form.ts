export type WoningType = 'Huur' | 'Koop' | 'Inwonend' | 'Dakloos';
export type AutoCount = 'Een' | 'Twee' | 'Nee';

export interface Member {
  id: string;
  memberType: string;
  naam?: string;
  leeftijd?: number;
  gender?: string;
  dateOfBirth?: string;
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
    woning?: WoningType;
    autoCount?: AutoCount;
  };
  C7: {
    items: Transaction[];
    inkomsten?: any;
    householdBenefits?: any;
    vermogen?: any;
  };
  [key: string]: any;
}

export type FormAction = {
  type: string;
  payload?: any;
  pageId?: string;
  field?: string;
  value?: any;
};

export interface TempFieldConfig {
  id: string;
  label: string;
  type: string;
  defaultValue?: string | number | boolean | null;
  required?: boolean;
}

export interface TempPageConfig {
  id: string;
  title: string;
  fields: TempFieldConfig[];
  description?: string;
}
