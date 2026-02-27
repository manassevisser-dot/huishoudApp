// src/domain/registry/PrimitiveRegistry.ts
import { IBaseRegistry } from './BaseRegistry';

/**
 * SSOT voor alle UI-primitive types, hun ViewModels en metadata.
 *
 * @module domain/registry
 * @see {@link ./README.md | Registry Layer — Details}
 *
 * @remarks
 * - `PRIMITIVE_TYPES` is de enige bron voor geldige primitive-strings.
 * - ViewModels zijn pure data-shapes; geen domein-logica, geen side effects.
 * - `PrimitiveRegistry` (de service) valideert runtime-input tegen `PRIMITIVE_METADATA`.
 */

/**
 * ═══════════════════════════════════════════════════════════
 * DOMAIN STYLE RULES
 * ═══════════════════════════════════════════════════════════
 */

/** Vrije stijl-map die rechtstreeks als React Native `style`-prop gebruikt kan worden. */
export type PrimitiveStyleRule = Record<string, string | number | undefined>;

/**
 * ═══════════════════════════════════════════════════════════
 * PRIMITIVE TYPES — SSOT
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Alle geldige primitive-strings als `as const`-object.
 *
 * @example
 * entry.primitiveType === PRIMITIVE_TYPES.CURRENCY
 */
export const PRIMITIVE_TYPES = {
  COUNTER:             'counter',
  CURRENCY:            'currency',
  TEXT:                'text',
  NUMBER:              'number',
  CHIP_GROUP:          'chip-group',
  CHIP_GROUP_MULTIPLE: 'chip-group-multiple',
  TOGGLE:              'toggle',
  RADIO:               'radio',
  LABEL:               'label',
  DATE:                'date',
  ACTION:              'action',
} as const;

/** Union van alle toegestane primitive-strings. Afgeleid van `PRIMITIVE_TYPES`. */
export type PrimitiveType = typeof PRIMITIVE_TYPES[keyof typeof PRIMITIVE_TYPES];

/**
 * ═══════════════════════════════════════════════════════════
 * PRIMITIVE VIEW MODELS
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Gedeelde velden voor alle primitives.
 *
 * @see {@link ./README.md | ViewModel-anatomie}
 */
export interface BasePrimitiveViewModel {
  /** Koppeling naar de Data/Field-laag. */
  fieldId:       string;
  primitiveType: PrimitiveType;
  error?:        string | null;
  errorStyle?:   PrimitiveStyleRule;
}

/** ViewModel voor een geheel-getal-teller met +/−-knoppen. */
export interface CounterViewModel extends BasePrimitiveViewModel {
  primitiveType:    typeof PRIMITIVE_TYPES.COUNTER;
  label:            string;
  value:            number;
  containerStyle:   PrimitiveStyleRule;
  labelStyle:       PrimitiveStyleRule;
  onCounterChange:  (value: number) => void;
}

/** ViewModel voor een geldbedrag-invoerveld (tekstgebaseerd, decimaal toetsenbord). */
export interface CurrencyViewModel extends BasePrimitiveViewModel {
  primitiveType:   typeof PRIMITIVE_TYPES.CURRENCY;
  label:           string;
  value:           string;
  placeholder?:    string;
  containerStyle:  PrimitiveStyleRule;
  labelStyle:      PrimitiveStyleRule;
  onCurrencyChange:(value: string) => void;
}

/** ViewModel voor een aan/uit-schakelaar met twee labels. */
export interface ToggleViewModel extends BasePrimitiveViewModel {
  primitiveType:  typeof PRIMITIVE_TYPES.TOGGLE;
  label:          string;
  value:          boolean;
  /** Label getoond wanneer `value === true`. */
  labelTrue:      string;
  /** Label getoond wanneer `value === false`. */
  labelFalse:     string;
  containerStyle: PrimitiveStyleRule;
  labelStyle:     PrimitiveStyleRule;
  onToggle:       (newValue: boolean) => void;
}

/** ViewModel voor een vrij-tekst-invoerveld. */
export interface TextViewModel extends BasePrimitiveViewModel {
  primitiveType:  typeof PRIMITIVE_TYPES.TEXT;
  label:          string;
  value:          string;
  placeholder?:   string;
  containerStyle: PrimitiveStyleRule;
  labelStyle:     PrimitiveStyleRule;
  onTextChange:   (text: string) => void;
}

/** ViewModel voor een numeriek invoerveld (string-gebaseerd voor flexibiliteit met decimalen). */
export interface NumberViewModel extends BasePrimitiveViewModel {
  primitiveType:   typeof PRIMITIVE_TYPES.NUMBER;
  label:           string;
  value:           string;
  placeholder?:    string;
  containerStyle:  PrimitiveStyleRule;
  labelStyle:      PrimitiveStyleRule;
  onNumberChange:  (value: string) => void;
}

/** Data-shape voor één chip binnen een `ChipGroupViewModel`. */
export interface ChipViewModel {
  label:              string;
  selected:           boolean;
  containerStyle:     PrimitiveStyleRule;
  textStyle:          PrimitiveStyleRule;
  onPress:            () => void;
  accessibilityLabel: string;
  accessibilityState: { selected: boolean };
}

/**
 * ViewModel voor een chipgroep.
 * Dekt zowel enkelvoudige (`chip-group`) als meervoudige (`chip-group-multiple`) selectie.
 *
 * @remarks
 * Het onderscheid enkelvoudig/meervoudig zit in `primitiveType` en in de
 * `onChange`-logica van de mapper, niet in de shape van dit ViewModel.
 */
export interface ChipGroupViewModel extends BasePrimitiveViewModel {
  primitiveType:      typeof PRIMITIVE_TYPES.CHIP_GROUP | typeof PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE;
  label:              string;
  containerStyle:     PrimitiveStyleRule;
  labelStyle:         PrimitiveStyleRule;
  chipContainerStyle: PrimitiveStyleRule;
  chips:              ChipViewModel[];
}

/** Data-shape voor één optie binnen een `RadioViewModel`. */
export interface RadioOptionViewModel {
  label:    string;
  value:    string;
  selected: boolean;
  onSelect: () => void;
}

/** ViewModel voor een groep radio-knoppen (één selectie). */
export interface RadioViewModel extends BasePrimitiveViewModel {
  primitiveType:       typeof PRIMITIVE_TYPES.RADIO;
  label:               string;
  containerStyle:      PrimitiveStyleRule;
  labelStyle:          PrimitiveStyleRule;
  radioContainerStyle: PrimitiveStyleRule;
  options:             RadioOptionViewModel[];
}

/** ViewModel voor een read-only sleutel/waarde-weergave. */
export interface LabelViewModel extends BasePrimitiveViewModel {
  primitiveType:  typeof PRIMITIVE_TYPES.LABEL;
  label:          string;
  value:          string;
  containerStyle: PrimitiveStyleRule;
  labelStyle:     PrimitiveStyleRule;
  valueStyle:     PrimitiveStyleRule;
}

/** ViewModel voor een datumkiezer. */
export interface DateViewModel extends BasePrimitiveViewModel {
  primitiveType:  typeof PRIMITIVE_TYPES.DATE;
  label:          string;
  value?:         string;
  containerStyle: PrimitiveStyleRule;
  labelStyle:     PrimitiveStyleRule;
  onDateChange:   (date: string) => void;
}

/**
 * ViewModel voor een navigatie- of actie-knop.
 *
 * @remarks
 * Geen `value` of `onChange` — puur een label + `onPress`-trigger.
 * De handler wordt opgelost via `commandTarget` of `navigationTarget` in `resolveChangeHandler`.
 */
export interface ActionViewModel extends BasePrimitiveViewModel {
  primitiveType:  typeof PRIMITIVE_TYPES.ACTION;
  label:          string;
  containerStyle: PrimitiveStyleRule;
  onPress:        () => void;
}

/**
 * Gediscrimineerde unie van alle PrimitiveViewModels.
 * Gebruik `primitiveType` als discriminant in switch-statements.
 *
 * @example
 * function render(vm: PrimitiveViewModel) {
 *   switch (vm.primitiveType) {
 *     case 'counter': return <CounterEntry viewModel={vm} />;
 *     // ...
 *   }
 * }
 */
export type PrimitiveViewModel =
  | CounterViewModel
  | CurrencyViewModel
  | TextViewModel
  | NumberViewModel
  | ChipGroupViewModel
  | RadioViewModel
  | LabelViewModel
  | DateViewModel
  | ToggleViewModel
  | ActionViewModel;

/**
 * ═══════════════════════════════════════════════════════════
 * PRIMITIVE METADATA & REGISTRY SERVICE
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Runtime-eigenschappen van één primitive type.
 * Gebruikt door `ScreenViewModelFactory` om invoer te valideren vóór rendering.
 *
 * @see {@link ./README.md | PrimitiveRegistry — metadata-tabel}
 */
export interface PrimitiveMetadata {
  type:               PrimitiveType;
  /** `true` als het type een niet-lege `options`-array vereist (chip-group, radio, toggle). */
  requiresOptions:    boolean;
  /** `true` als het type een `placeholder`-string accepteert. */
  supportsPlaceholder:boolean;
  /** `true` als het type geen gebruikersinvoer verwerkt (label, action). */
  isReadOnly:         boolean;
  /** `true` als het type meerdere waarden tegelijk kan selecteren. */
  supportsMultiSelect:boolean;
}

const PRIMITIVE_METADATA: Record<PrimitiveType, PrimitiveMetadata> = {
  [PRIMITIVE_TYPES.COUNTER]:             { type: PRIMITIVE_TYPES.COUNTER,             requiresOptions: false, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.CURRENCY]:            { type: PRIMITIVE_TYPES.CURRENCY,            requiresOptions: false, supportsPlaceholder: true,  isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.TEXT]:                { type: PRIMITIVE_TYPES.TEXT,                requiresOptions: false, supportsPlaceholder: true,  isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.NUMBER]:              { type: PRIMITIVE_TYPES.NUMBER,              requiresOptions: false, supportsPlaceholder: true,  isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.CHIP_GROUP]:          { type: PRIMITIVE_TYPES.CHIP_GROUP,          requiresOptions: true,  supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE]: { type: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE, requiresOptions: true,  supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: true  },
  [PRIMITIVE_TYPES.RADIO]:               { type: PRIMITIVE_TYPES.RADIO,               requiresOptions: true,  supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.LABEL]:              { type: PRIMITIVE_TYPES.LABEL,               requiresOptions: false, supportsPlaceholder: false, isReadOnly: true,  supportsMultiSelect: false },
  [PRIMITIVE_TYPES.DATE]:                { type: PRIMITIVE_TYPES.DATE,                requiresOptions: false, supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.TOGGLE]:              { type: PRIMITIVE_TYPES.TOGGLE,              requiresOptions: true,  supportsPlaceholder: false, isReadOnly: false, supportsMultiSelect: false },
  [PRIMITIVE_TYPES.ACTION]:              { type: PRIMITIVE_TYPES.ACTION,              requiresOptions: false, supportsPlaceholder: false, isReadOnly: true,  supportsMultiSelect: false },
};

/**
 * Opzoek-service voor `PrimitiveMetadata` op basis van `PrimitiveType`.
 *
 * @example
 * const meta = PrimitiveRegistry.getDefinition('chip-group');
 * if (meta?.requiresOptions && !entry.options?.length) throw new Error(...);
 */
export const PrimitiveRegistry: IBaseRegistry<PrimitiveType, PrimitiveMetadata> = {
  getDefinition: (key: string) =>
    (key in PRIMITIVE_METADATA) ? PRIMITIVE_METADATA[key as PrimitiveType] : null,
  isValidKey:    (key: string): key is PrimitiveType => (key in PRIMITIVE_METADATA) === true,
  getAllKeys:     () => Object.keys(PRIMITIVE_METADATA) as PrimitiveType[],
};

/**
 * ═══════════════════════════════════════════════════════════
 * HELPER FUNCTIONS
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Type guard voor runtime validatie van een primitive-string.
 *
 * @param type - Te valideren string
 * @returns `true` als `type` een bekende `PrimitiveType` is
 *
 * @example
 * if (isValidPrimitiveType(entry.primitiveType)) { ... }
 */
export function isValidPrimitiveType(type: string): type is PrimitiveType {
  return type in PRIMITIVE_METADATA;
}

/**
 * Valideert of een primitive-instantie aan zijn eigen `requiresOptions`-contract voldoet.
 *
 * @param primitiveType - Het te controleren type
 * @param hasOptions    - `true` als de aanroeper opties heeft meegegeven
 * @returns `false` als het type opties vereist maar er geen zijn, of als het type onbekend is
 *
 * @example
 * if (!validatePrimitiveRequirements('chip-group', !!entry.options?.length)) {
 *   throw new Error(`chip-group vereist opties`);
 * }
 */
export function validatePrimitiveRequirements(
  primitiveType: PrimitiveType,
  hasOptions: boolean,
): boolean {
  const metadata = PrimitiveRegistry.getDefinition(primitiveType);
  if (metadata === null) return false;
  if (metadata.requiresOptions && !hasOptions) return false;
  return true;
}
