import { 
  FormState, 
  Member, 
  Auto,  
  DataSection
} from '@adapters/validation/formStateSchema';

// Hiermee geef je de EXACTE types door zonder een kopie te maken
export type { FormState, Member, Auto, DataSection };

type ElementOf<T> = T extends readonly (infer U)[] ? U : never;

// Deze zijn prima, want dit zijn afgeleide sub-types die niet in de adapter staan
export type SetupData = FormState['data']['setup'];
export type Household = FormState['data']['household'];
export type Finance   = FormState['data']['finance'];

// De rest van je bestand...
export type IncomeItem  = ElementOf<NonNullable<Finance['income']['items']>>;
export type ExpenseItem = ElementOf<NonNullable<Finance['expenses']['items']>>;


export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};