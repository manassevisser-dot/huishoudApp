import type { FormState, DataSection } from './core';

export type FieldType =
  | 'counter' | 'text' | 'radio-chips' | 'toggle' | 'repeater'
  | 'date' | 'select' | 'money' | 'section' | 'collapsible-section' | 'derived-label';

export interface FieldConfig {
  fieldId: string;
  type: FieldType;
  section?: DataSection;
  labelToken?: string;
  label?: string;
  options?: Array<{ label: string; value: unknown }>;
  fields?: FieldConfig[]; // Recursief (verwijst naar zichzelf, dat mag)
  
  min?: number;
  max?: number;
  required?: boolean;
  
  validation?: {
    min?: number;
    max?: number;
    postcode?: boolean;
    pattern?: string;
    lengthEqualsTo?: string | number;
  };

  // Hier gebruiken we de Core types
  visibleIf?: string | ((state: FormState) => boolean);
  valueGetter?: (state: FormState) => unknown;
  maxGetter?: (state: FormState) => number;
  countGetter?: (state: FormState) => number;
  filter?: (state: FormState) => unknown[];
  dependentField?: FieldConfig;
  defaultValue?: unknown;
}
