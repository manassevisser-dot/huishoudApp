import * as React from 'react';

export interface FieldConfig {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    postcode?: boolean;
    lengthEqualsTo?: number;
    [key: string]: any;
  };
  // De 'Glue': laat de compiler alle extra properties toe die in de config bestanden staan
  [key: string]: any; 
}

export type FormAction = { type: string; payload?: any };

export interface FormState {
  activeStep: string;
  data: Record<string, any>; // 'any' zorgt dat zowel "1.000" als 1000 mag
  [key: string]: any;
}