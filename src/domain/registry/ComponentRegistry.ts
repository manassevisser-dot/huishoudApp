// src/domain/registry/ComponentRegistry.ts

/**
 * ═══════════════════════════════════════════════════════════
 * DOMAIN STYLE RULES
 * ═══════════════════════════════════════════════════════════
 * * In this architecture, visual rules (colors, spacing, typography) 
 * are considered domain knowledge. This type allows the Orchestrator 
 * to dictate these rules without knowing about platform-specific UI types.
 */
export type ComponentStyleRule = Record<string, string | number | undefined>;

/**
 * ═══════════════════════════════════════════════════════════
 * COMPONENT TYPES - SINGLE SOURCE OF TRUTH
 * ═══════════════════════════════════════════════════════════
 */
export const COMPONENT_TYPES = {
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

export type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES];

/**
 * ═══════════════════════════════════════════════════════════
 * COMPONENT VIEW MODELS
 * ═══════════════════════════════════════════════════════════
 */

// ──────────── BASE ────────────

export interface BaseComponentViewModel {
  fieldId: string;
  componentType: ComponentType;
  error?: string | null;
  errorStyle?: ComponentStyleRule; // Domein-regel voor fout-weergave
}

// ──────────── COUNTER ────────────

export interface CounterViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.COUNTER;
  label: string;
  value: number;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  onUpdate: (value: number) => void;
}

// ──────────── CURRENCY ────────────

export interface CurrencyViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.CURRENCY;
  label: string;
  value: number;
  placeholder?: string;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  onUpdate: (value: number) => void;
}

// ──────────── TOGGLE ────────────

export interface ToggleViewModel extends BaseComponentViewModel {
  componentType: 'toggle';
  label: string;
  value: boolean;
  labelTrue: string;
  labelFalse: string;
  containerStyle: ComponentStyleRule; // Dit is een TYPE, dus dit is correct hier
  labelStyle: ComponentStyleRule;     // Dit is een TYPE, dus dit is correct hier
  onToggle: (newValue: boolean) => void;
}
// ──────────── TEXT ────────────

export interface TextViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.TEXT;
  label: string;
  value: string;
  placeholder?: string;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  onChangeText: (text: string) => void;
}

// ──────────── NUMBER ────────────

export interface NumberViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.NUMBER;
  label: string;
  value: number;
  placeholder?: string;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  onChangeText: (value: number) => void;
}

// ──────────── CHIPS ────────────

export interface ChipViewModel {
  label: string;
  selected: boolean;
  containerStyle: ComponentStyleRule;
  textStyle: ComponentStyleRule;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityState: { selected: boolean };
}

export interface ChipGroupViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.CHIP_GROUP | typeof COMPONENT_TYPES.CHIP_GROUP_MULTIPLE;
  label: string;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  chipContainerStyle: ComponentStyleRule;
  chips: ChipViewModel[];
}

// ──────────── RADIO ────────────

export interface RadioOptionViewModel {
  label: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
}

export interface RadioViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.RADIO;
  label: string;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  radioContainerStyle: ComponentStyleRule;
  options: RadioOptionViewModel[];
}

// ──────────── LABEL (read-only) ────────────

export interface LabelViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.LABEL;
  label: string;
  value: string;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  valueStyle: ComponentStyleRule;
}

// ──────────── DATE ────────────

export interface DateViewModel extends BaseComponentViewModel {
  componentType: typeof COMPONENT_TYPES.DATE;
  label: string;
  value?: Date;
  containerStyle: ComponentStyleRule;
  labelStyle: ComponentStyleRule;
  onChange: (date: Date) => void;
}

// ──────────── UNION TYPE ────────────

export type ComponentViewModel =
  | CounterViewModel
  | CurrencyViewModel
  | TextViewModel
  | NumberViewModel
  | ChipGroupViewModel
  | RadioViewModel
  | LabelViewModel
  | DateViewModel
  | ToggleViewModel;



/**
 * ═══════════════════════════════════════════════════════════
 * COMPONENT METADATA REGISTRY
 * ═══════════════════════════════════════════════════════════
 * 
 * Defines characteristics of each component type.
 * Used for validation and dynamic behavior.
 */
export interface ComponentMetadata {
  type: ComponentType;
  requiresOptions: boolean;     // Must have options array?
  supportsPlaceholder: boolean; // Can have placeholder text?
  isReadOnly: boolean;          // User cannot edit?
  supportsMultiSelect: boolean; // Can select multiple values?
}

export const COMPONENT_METADATA: Record<ComponentType, ComponentMetadata> = {
  [COMPONENT_TYPES.COUNTER]: {
    type: COMPONENT_TYPES.COUNTER,
    requiresOptions: false,
    supportsPlaceholder: false,
    isReadOnly: false,
    supportsMultiSelect: false,
  },
  
  [COMPONENT_TYPES.CURRENCY]: {
    type: COMPONENT_TYPES.CURRENCY,
    requiresOptions: false,
    supportsPlaceholder: true,
    isReadOnly: false,
    supportsMultiSelect: false,
  },
  
  [COMPONENT_TYPES.TEXT]: {
    type: COMPONENT_TYPES.TEXT,
    requiresOptions: false,
    supportsPlaceholder: true,
    isReadOnly: false,
    supportsMultiSelect: false,
  },
  
  [COMPONENT_TYPES.NUMBER]: {
    type: COMPONENT_TYPES.NUMBER,
    requiresOptions: false,
    supportsPlaceholder: true,
    isReadOnly: false,
    supportsMultiSelect: false,
  },
  
  [COMPONENT_TYPES.CHIP_GROUP]: {
    type: COMPONENT_TYPES.CHIP_GROUP,
    requiresOptions: true,
    supportsPlaceholder: false,
    isReadOnly: false,
    supportsMultiSelect: false,
  },
  
  [COMPONENT_TYPES.CHIP_GROUP_MULTIPLE]: {
    type: COMPONENT_TYPES.CHIP_GROUP_MULTIPLE,
    requiresOptions: true,
    supportsPlaceholder: false,
    isReadOnly: false,
    supportsMultiSelect: true,
  },
  
  [COMPONENT_TYPES.RADIO]: {
    type: COMPONENT_TYPES.RADIO,
    requiresOptions: true,
    supportsPlaceholder: false,
    isReadOnly: false,
    supportsMultiSelect: false,
  },
  
  [COMPONENT_TYPES.LABEL]: {
    type: COMPONENT_TYPES.LABEL,
    requiresOptions: false,
    supportsPlaceholder: false,
    isReadOnly: true,
    supportsMultiSelect: false,
  },
  
  [COMPONENT_TYPES.DATE]: {
    type: COMPONENT_TYPES.DATE,
    requiresOptions: false,
    supportsPlaceholder: false,
    isReadOnly: false,
    supportsMultiSelect: false,
  },
    [COMPONENT_TYPES.TOGGLE]: {
      type: COMPONENT_TYPES.TOGGLE,
      requiresOptions: true,
      supportsPlaceholder: false,
      isReadOnly: false,
      supportsMultiSelect: false,
    },
  };


/**
 * ═══════════════════════════════════════════════════════════
 * HELPER FUNCTIONS
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Get metadata for a component type
 */
export function getComponentMetadata(type: ComponentType): ComponentMetadata {
  return COMPONENT_METADATA[type];
}

/**
 * Check if a string is a valid component type
 */
export function isValidComponentType(type: string): type is ComponentType {
  return Object.values(COMPONENT_TYPES).includes(type as ComponentType);
}

/**
 * Validate that a FieldViewModel has required options for its type
 */
export function validateComponentRequirements(
  componentType: ComponentType,
  hasOptions: boolean
): boolean {
  const metadata = getComponentMetadata(componentType);
  if (metadata.requiresOptions && !hasOptions) {
    return false;
  }
  return true;
}