import type { FormState, DataSection, DeepPartial } from './core';
import { FieldConfig } from '@shared-types/form';

export interface WizardPageConfig {
  pageId: string;
  titleToken?: string;
  title?: string;
  section?: DataSection;
  componentName?: 'WizardPage' | 'SummaryPage' | 'CustomPage' | string;
  fields: FieldConfig[];
  onNext?: (state: FormState) => string;
}

export type FormAction =
  | { type: 'SET_FIELD'; payload: { section: DataSection; field: string; value: any } }
  | { type: 'UPDATE_DATA'; payload: DeepPartial<FormState['data']> }
  | { type: 'SET_STEP'; payload: string }
  | { type: 'SYNC_MEMBERS'; payload: Array<Record<string, unknown>> }
  | { type: 'RESET_APP' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };
