// src/domain/registry/SectionRegistry.ts
/**
 * @file_intent Groepeert Entries in logische secties en definieert de layout (grid, list, etc).
 * @repo_architecture Mobile Industry (MI) - De 'Orchestration'-laag van de UI-configuratie.
 * @term_definition SectionDefinition = Groepering van entries. fieldIds = De keys die verwijzen naar de EntryRegistry.
 * @contract Een sectie bevat een lijst van 'fieldIds'. Deze IDs MOETEN bestaan in de EntryRegistry om gerenderd te kunnen worden.
 * @ai_instruction Gebruik 'fieldIds' hier als verwijzing naar de EntryRegistry. Wijzig de layout-types alleen als de UI-laag deze ondersteunt.
 */
import { IBaseRegistry } from './BaseRegistry';

export interface SectionDefinition {
  id: string;
  labelToken: string;
  fieldIds: string[];
  layout: 'list' | 'grid' | 'card' | 'stepper';
  uiModel?: 'numericWrapper' | 'collapsible' | 'swipeable' | 'readonly';
}

export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  householdSetup: {
    id: 'householdSetup',
    labelToken: 'SECTION_HOUSEHOLD_SETUP',
    layout: 'list',
    fieldIds: ['aantalMensen', 'aantalVolwassen', 'kinderenLabel', 'autoCount', 'heeftHuisdieren'],
  },
  workToeslagen: {
    id: 'workToeslagen',
    labelToken: 'LABEL_TOESLAGEN',
    layout: 'card',
    uiModel: 'numericWrapper',
    fieldIds: ['zorgtoeslag', 'reiskosten', 'overigeInkomsten'],
  },
  householdDetails: {
    id: 'householdDetails',
    labelToken: 'SECTION_HOUSEHOLD_DETAILS',
    layout: 'grid',
    fieldIds: ['burgerlijkeStaat', 'woningType', 'postcode'],
  },
  incomeDetails: {
    id: 'incomeDetails',
    labelToken: 'SECTION_INCOME',
    layout: 'list',
    fieldIds: ['incomeCategory', 'nettoSalaris', 'frequentie', 'vakantiegeldPerJaar'],
  },
  fixedExpenses: {
    id: 'fixedExpenses',
    labelToken: 'SECTION_FIXED_EXPENSES',
    layout: 'card',
    fieldIds: ['kaleHuur', 'hypotheekBruto', 'energieGas', 'water', 'telefoon'],
  },
  overigeVerzekeringen: {
    id: 'overigeVerzekeringen',
    labelToken: 'LABEL_OVERIGE_VERZEKERINGEN',
    layout: 'list',
    fieldIds: ['aansprakelijkheid', 'reis', 'opstal'],
  },
  abonnementen: {
    id: 'abonnementen',
    labelToken: 'LABEL_ABONNEMENTEN',
    layout: 'grid',
    fieldIds: ['internetTv', 'sport', 'lezen'],
  },
  loginSection: {
    id: 'loginSection',
    labelToken: 'SECTION_LOGIN',
    layout: 'list',
    fieldIds: ['naam'], // We gebruiken 'naam' even als placeholder voor login-invoer
  },
  memberDetails: {
    id: 'memberDetails',
    labelToken: 'SECTION_MEMBER_DETAILS',
    layout: 'card',
    uiModel: 'collapsible', // Handig als je 5 mensen hebt
    fieldIds: ['naam', 'geboortedatum', 'gender'],
  },
};
  export const SectionRegistry: IBaseRegistry<string, SectionDefinition> = {
    // Fix: Voorkom 'always true' object-waarschuwing door expliciete check
    getDefinition: (key: string) => (key in SECTION_REGISTRY) ? SECTION_REGISTRY[key] : null,
    // Fix: Expliciete boolean vergelijking voor de linter
    isValidKey: (key: string): key is string => (key in SECTION_REGISTRY) === true,
    getAllKeys: () => Object.keys(SECTION_REGISTRY),
  };