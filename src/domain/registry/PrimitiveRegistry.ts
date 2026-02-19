// src/domain/registry/PrimitiveRegistry.ts
import { IBaseRegistry } from './BaseRegistry';

/**
 * @file_intent Definieert de meest fundamentele UI-bouwstenen (Primitives) van de applicatie.
 * @repo_architecture Mobile Industry (MI) - Dit is de 'Leaf'-laag. Primitives weten niets van domein-logica, alleen van UI-data structuren.
 * @term_definition PrimitiveType = De technische variant (counter, currency, etc). PrimitiveViewModel = De data-vorm die een UI-component verwacht.
 * @contract Biedt metadata over wat elke primitive technisch nodig heeft (zoals opties of placeholders).
 * @ai_instruction Primitives zijn 'pure' UI-modellen. Voeg hier geen domein-specifieke velden toe. Gebruik fieldId enkel als technische referentie.
 */

/**
 * ═══════════════════════════════════════════════════════════
 * DOMAIN STYLE RULES
 * ═══════════════════════════════════════════════════════════
 */
export type PrimitiveStyleRule = Record<string, string | number | undefined>;

/**
 * ═══════════════════════════════════════════════════════════
 * PRIMITIVE TYPES - SINGLE SOURCE OF TRUTH
 * ═══════════════════════════════════════════════════════════
 */
export const PRIMITIVE_TYPES = {
  COUNTER: 'counter',
  CURRENCY: 'currency',
  TEXT: 'text',
  NUMBER: 'number',
  CHIP_GROUP: 'chip-group',
  CHIP_GROUP_MULTIPLE: 'chip-group-multiple',
  TOGGLE: 'toggle',
  RADIO: 'radio',
  LABEL: 'label',
  DATE: 'date',
} as const;

export type PrimitiveType = typeof PRIMITIVE_TYPES[keyof typeof PRIMITIVE_TYPES];

/**
 * ═══════════════════════════════════════════════════════════
 * PRIMITIVE VIEW MODELS
 * ═══════════════════════════════════════════════════════════
 */

export interface BasePrimitiveViewModel {
  fieldId: string; // De koppeling naar de Data/Field laag
  primitiveType: PrimitiveType;
  error?: string | null;
  errorStyle?: PrimitiveStyleRule;
}

export interface CounterViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.COUNTER;
  label: string;
  value: number;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  onCounterChange: (value: number) => void;
}

export interface CurrencyViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.CURRENCY;
  label: string;
  value: string;
  placeholder?: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  onCurrencyChange: (value: string) => void;
}

export interface ToggleViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.TOGGLE;
  label: string;
  value: boolean;
  labelTrue: string;
  labelFalse: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  onToggle: (newValue: boolean) => void;
}

export interface TextViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.TEXT;
  label: string;
  value: string;
  placeholder?: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  onTextChange: (text: string) => void;
}

export interface NumberViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.NUMBER;
  label: string;
  value: string;
  placeholder?: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  onNumberChange: (value: string) => void;
}

export interface ChipViewModel {
  label: string;
  selected: boolean;
  containerStyle: PrimitiveStyleRule;
  textStyle: PrimitiveStyleRule;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityState: { selected: boolean };
}

export interface ChipGroupViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.CHIP_GROUP | typeof PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE;
  label: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  chipContainerStyle: PrimitiveStyleRule;
  chips: ChipViewModel[];
}

export interface RadioOptionViewModel {
  label: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
}

export interface RadioViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.RADIO;
  label: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  radioContainerStyle: PrimitiveStyleRule;
  options: RadioOptionViewModel[];
}

export interface LabelViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.LABEL;
  label: string;
  value: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  valueStyle: PrimitiveStyleRule;
}

export interface DateViewModel extends BasePrimitiveViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.DATE;
  label: string;
  value?: string;
  containerStyle: PrimitiveStyleRule;
  labelStyle: PrimitiveStyleRule;
  onDateChange: (date: string) => void;
}

export type PrimitiveViewModel =
  | CounterViewModel
  | CurrencyViewModel
  | TextViewModel
  | NumberViewModel
  | ChipGroupViewModel
  | RadioViewModel
  | LabelViewModel
  | DateViewModel
  | ToggleViewModel;

export interface PrimitiveMetadata {
  type: PrimitiveType;
  requiresOptions: boolean;
  supportsPlaceholder: boolean;
  isReadOnly: boolean;
  supportsMultiSelect: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════
 * DATA & REGISTRY SERVICE
 * ═══════════════════════════════════════════════════════════
 */

export interface PrimitiveMetadata {
  type: PrimitiveType;
  requiresOptions: boolean;
  supportsPlaceholder: boolean;
  isReadOnly: boolean;
  supportsMultiSelect: boolean;
}

const PRIMITIVE_METADATA: Record<PrimitiveType, PrimitiveMetadata> = {
  [PRIMITIVE_TYPES.COUNTER]: { type: PRIMITIVE_TYPES.COUNTER, requiresOptions: false, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.CURRENCY]: { type: PRIMITIVE_TYPES.CURRENCY, requiresOptions: false, supportsPlaceholder: true, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.TEXT]: { type: PRIMITIVE_TYPES.TEXT, requiresOptions: false, supportsPlaceholder: true, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.NUMBER]: { type: PRIMITIVE_TYPES.NUMBER, requiresOptions: false, supportsPlaceholder: true, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.CHIP_GROUP]: { type: PRIMITIVE_TYPES.CHIP_GROUP, requiresOptions: true, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE]: { type: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE, requiresOptions: true, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: true },
  [PRIMITIVE_TYPES.RADIO]: { type: PRIMITIVE_TYPES.RADIO, requiresOptions: true, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.LABEL]: { type: PRIMITIVE_TYPES.LABEL, requiresOptions: false, supportsPlaceholder: false, isReadOnly: true, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.DATE]: { type: PRIMITIVE_TYPES.DATE, requiresOptions: false, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.TOGGLE]: { type: PRIMITIVE_TYPES.TOGGLE, requiresOptions: true, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
};

export const PrimitiveRegistry: IBaseRegistry<PrimitiveType, PrimitiveMetadata> = {
  getDefinition: (key: string) => (key in PRIMITIVE_METADATA) ? PRIMITIVE_METADATA[key as PrimitiveType] : null,
  isValidKey: (key: string): key is PrimitiveType => (key in PRIMITIVE_METADATA) === true,
  getAllKeys: () => Object.keys(PRIMITIVE_METADATA) as PrimitiveType[],
};

/**
 * ═══════════════════════════════════════════════════════════
 * HELPER FUNCTIONS
 * ═══════════════════════════════════════════════════════════
 */

export function isValidPrimitiveType(type: string): type is PrimitiveType {
  return type in PRIMITIVE_METADATA;
}

export function validatePrimitiveRequirements(
  primitiveType: PrimitiveType,
  hasOptions: boolean
): boolean {
  const metadata = PrimitiveRegistry.getDefinition(primitiveType);
  
  if (metadata === null) { // Fix: null check naar falsy check
    return false;
  }

  if (metadata.requiresOptions && !hasOptions) {
    return false;
  }
  
  return true;
}