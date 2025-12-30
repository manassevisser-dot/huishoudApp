import { Member } from '../domain/household';

export interface FormFieldConfig {
  fieldId: string;
  id?: string; // Tijdelijk voor legacy support
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'counter' | 'repeater' | 'section' | 'collapsible-section';
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    postcode?: boolean;
    lengthEqualsTo?: string | number;
    [key: string]: any;
  };
  visibleIf?: string | ((state: any) => boolean); 
  condition?: string | ((state: any) => boolean);
  dependentField?: any;
  [key: string]: any; // Catch-all voor custom props in configs
}

export type FieldConfig = FormFieldConfig;

export interface WizardPageConfig {
  pageId: string;
  title: string;
  description?: string;
  componentName: string;
  fields?: FormFieldConfig[];
}

export type TempPageConfig = WizardPageConfig;

export interface FormState {
  currentPageId: string;
  activeStep: number | string; // Laat beide toe voor Navigator vs Wizard
  data: {
    setup: any;
    household: {
      members: Member[];
      [key: string]: any;
    };
    finance: any;
  };
  // Legacy support (voor AdultsCounter.tsx en WizardPage.tsx)
  setup?: any;
  household?: any; 
  isValid: boolean;
  [key: string]: any; 
}

export type FormAction = 
  | { type: 'SET_PAGE'; pageId: string }
  | { type: 'UPDATE_MEMBER'; index: number; member: Partial<Member> }
  | { type: 'SET_VALUE'; payload: any }
  | { type: 'SET_FIELD'; fieldId: string; value: any; payload?: any }
  | { type: 'SET_MEMBER_VALUE'; index: number; field: string; value: any }
  | { type: 'SYNC_MEMBERS'; payload: any }
  | { type: 'RESET_APP' }
  | { type: 'SYNC_HOUSEHOLD'; aantalMensen: number; aantalVolwassen: number };