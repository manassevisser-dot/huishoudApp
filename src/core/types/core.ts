// src/core/types/core.ts
/**
 * @file_intent Aggregeert en exporteert de centrale domein-types van de applicatie, en biedt utility types voor diepe data-manipulatie.
 * @repo_architecture Mobile Industry (MI) - Core Type Definition Layer.
 * @term_definition ElementOf<T> = Een inferentie-utility die het type van een enkel item uit een array extraheert. DeepPartial<T> = Een recursief type dat alle eigenschappen (en sub-eigenschappen) van een object optioneel maakt, cruciaal voor state-patches.
 * @contract Fungeert als de publieke API voor de datastructuur van de applicatie. Het verbindt de door Zod gegenereerde schema-types uit de adapter-laag met de rest van de codebase, waardoor type-safety in orchestrators en reducers wordt gegarandeerd.
 * @ai_instruction Gebruik de afgeleide types zoals `IncomeItem` en `ExpenseItem` bij het mappen van lijsten in de UI om directe afhankelijkheid van de diepe `FormState` structuur te verminderen. Gebruik `DeepPartial` specifiek voor de payload van acties die de state gedeeltelijk bijwerken.
 */
import { 
  FormState, 
  Member, 
  Auto,  
  DataSection
} from '@adapters/validation/formStateSchema';

export type { FormState, Member, Auto, DataSection };

type ElementOf<T> = T extends readonly (infer U)[] ? U : never;

export type SetupData = FormState['data']['setup'];
export type Household = FormState['data']['household'];
export type Finance   = FormState['data']['finance'];

export type IncomeItem  = ElementOf<NonNullable<Finance['income']['items']>>;
export type ExpenseItem = ElementOf<NonNullable<Finance['expenses']['items']>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};