import { z } from 'zod';
import { FormStateSchema } from '../../adapters/validation/formStateSchema';
import { Member as SchemaMember } from '@state/schemas/sections/household.schema';
export type CoreMember = SchemaMember;
// 1. De Basis (SSOT: schema)
type RawFormState = z.infer<typeof FormStateSchema>;

// 2. De Uitgebreide FormState met ViewModels
export interface FormState extends RawFormState {
  viewModels: {
    financialSummary?: {
      totalIncomeDisplay: string;
      totalExpensesDisplay: string;
      netDisplay: string;
    };
  };
}

// 3. Alle sub-types (afgeleid, geen eigen SSOT)
export type Household = FormState['data']['household'];
export type Member = Household['members'][number];
export type SetupData = FormState['data']['setup'];
export type Finance = FormState['data']['finance'];
export type Income = Finance['income'];
export type Expenses = Finance['expenses'];

// Enums/Keys uit het schema
export type IncomeFrequency =
  FormState['data']['finance']['income']['items'][number]['frequency'];

export type DataSection = keyof FormState['data'];

// 4. Infrastructuur voor Reducer & Orchestrator
export type FormAction =
  | {
      type: 'UPDATE_DATA';
      payload: {
        section: DataSection;
        field: string;
        value: string | number | boolean | object | null | undefined;
      };
    }
  | {
      type: 'UPDATE_VIEWMODEL';
      payload: Partial<FormState['viewModels']>;
    }
  | { type: 'SET_STEP'; payload: string }
  | { type: 'RESET_APP' };

// 5. Utility
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};
