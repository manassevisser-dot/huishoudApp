import { Member } from '@domain/household';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

export type DataSection = 'setup' | 'household' | 'finance';

export interface FormState {
  schemaVersion: string;
  activeStep: string;
  currentPageId: string;
  isValid: boolean;
  data: {
    setup: {
      aantalMensen: number;
      aantalVolwassen: number;
      autoCount: 'Nee' | 'Een' | 'Twee';
      heeftHuisdieren?: boolean;
      [key: string]: unknown;
    };
    household: { members: Member[];  
      huurtoeslag?: number;    // ➕ ADD
      zorgtoeslag?: number;    // ➕ ADD };
    };
    finance: {
      income: { items: Array<Record<string, unknown>>; totalAmount?: number };
      expenses: { items: Array<Record<string, unknown>>; totalAmount?: number };
    };
  };
  meta: { lastModified: string; version: number };
}
