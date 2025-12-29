import * as React from 'react';

export interface FieldOption {
  label: string;
  value: any;
}

export interface FieldConfig {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  defaultValue?: any;
  // Phoenix Dynamische Logica
  visibleIf?: (state: FormState, memberId?: string) => boolean;
  valueGetter?: (state: FormState) => any;
  maxGetter?: (state: FormState) => number;
  countGetter?: (state: FormState) => number;
  filter?: (state: FormState) => any[];
  // Voor geneste velden (repeater/section)
  fields?: FieldConfig[]; 
  [key: string]: any; 
}

export interface WizardPageConfig {
  id: string;
  title: string;
  description?: string; // Voeg dit optionele veld toe
  fields: any[];
}

// Alias voor jouw 'TempPageConfig' import
export type TempPageConfig = WizardPageConfig;

export interface FormState {
  activeStep: string;
  data: Record<string, any>;
  setup?: Record<string, any>;
  household?: {
    adultsCount: number;
    members: Member[]; // Gebruik de nieuwe Member interface
    leden?: any[];
  };
  finance?: {
    inkomsten: Record<string, any>;
    uitgaven: Record<string, any>;
  };
  [key: string]: any;
}

export type FormAction = 
  | { type: 'UPDATE_FIELD'; payload: { fieldId: string; value: any } }
  | { type: 'SYNC_MEMBERS'; payload: { count: number } }
  | { type: 'SET_STEP'; payload: string }
  | { type: string; payload?: any }; 

export interface Member {
  id: string;
  naam?: string;
  memberType: 'adult' | 'child';
  [key: string]: any;
}

export type WoningType = 'huur' | 'koop' | 'anders';

export type AutoCount = 'Nee' | 'Een' | 'Twee';

