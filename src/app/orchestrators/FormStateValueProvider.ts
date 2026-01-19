import { ValueProvider } from '@domain/rules/ValueProvider';

/**
 * Concrete implementatie van ValueProvider voor FormState.
 * Lost geneste paden op (bijv. 'income.grossMonthly').
 */
export class FormStateValueProvider implements ValueProvider {
  constructor(private formState: Record<string, any>) {}

  getValue(fieldPath: string): unknown {
    return fieldPath.split('.').reduce((obj, key) => obj?.[key], this.formState);
  }
}