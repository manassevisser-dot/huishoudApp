import { FormState } from './core';

export interface ExtendedFormState extends FormState {
  errors: Record<string, unknown>;
  touched: Record<string, unknown>;
  isSubmitting: boolean;
  isDirty: boolean;
}
