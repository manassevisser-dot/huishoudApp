// src/app/orchestrators/ComponentOrchestrator.ts

import {
  ComponentViewModel,
  CounterViewModel,
  CurrencyViewModel,
  TextViewModel,
  NumberViewModel,
  ChipGroupViewModel,
  ChipViewModel,
  RadioViewModel,
  RadioOptionViewModel,
  LabelViewModel,
  DateViewModel,
  COMPONENT_TYPES,
  ComponentType,
  getComponentMetadata,
} from '@domain/registry/ComponentRegistry';
import { FieldViewModel } from './RenderOrchestrator';
import { labelFromToken } from '@domain/constants/labelResolver';
import { isoDateOnlyToLocalNoon, toISOFromLocal } from '@domain/helpers/DateHydrator';
import { ComponentStyleFactory as Style } from '@domain/styles/ComponentStyleFactory';


/**
 * Helper: ensureOptionsIfRequired
 *
 * Controleert of een component options vereist volgens zijn metadata
 * en of die options daadwerkelijk aanwezig zijn in het ViewModel.
 *
 * @returns true als de component veilig gebouwd kan worden, anders false.
 * @sideeffect Logt een warning als options ontbreken terwijl ze vereist zijn.
 */
type BuilderFn = (vm: FieldViewModel) => ComponentViewModel;

const ensureOptionsIfRequired = (
  vm: FieldViewModel
): boolean => {
  const metadata = getComponentMetadata(vm.componentType as ComponentType);
  if (metadata.requiresOptions === true && (vm.options === null || vm.options === undefined)) {
    console.warn(`Component ${vm.componentType} requires options but none provided for ${vm.fieldId}`);
    return false;
  }
  return true;
};
/**
 * ═══════════════════════════════════════════════════════════
 * UPDATE CALLBACK - Facade from MasterOrchestrator
 * ═══════════════════════════════════════════════════════════
 * 
 * ComponentOrchestrator does NOT know about FormStateOrchestrator!
 * It receives this callback from MasterOrchestrator.
 * 
 * This maintains vertical architecture (no horizontal dependencies).
 */
export type UpdateFieldCallback = (fieldId: string, value: unknown) => void;

/**
 * ═══════════════════════════════════════════════════════════
 * COMPONENT ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════
 * 
 * Transforms FieldViewModels → ComponentViewModels
 * 
 * Responsibilities:
 * - Resolve label tokens to display strings
 * - Compute styles (containerStyle, labelStyle, etc.) via ComponentStyleFactory
 * - Type-safe value conversions (string → number, etc.)
 * - Build callbacks (pre-bound to updateField)
 * - Pre-build nested structures (chips, radio options)
 * 
 * Does NOT:
 * - Access state directly (uses FieldViewModel)
 * - Know about other orchestrators (uses callbacks)
 * - Contain business logic (pure transformation)
 * - Visibility is pre-filtered by UIManager
 * 
 * Architecture:
 * - Private to UIManager
 * - No horizontal dependencies
 * - Uses ComponentRegistry SSOT
 */
export class ComponentOrchestrator {
  // GEEN 'styles' meer in de constructor!
  constructor(private readonly updateField: UpdateFieldCallback) {}

  /**
   * ═══════════════════════════════════════════════════════════
   * PUBLIC API
   * ═══════════════════════════════════════════════════════════
   */

  /**
   * Main entry point: FieldViewModel → ComponentViewModel
   * 
   * Uses exhaustive switch with COMPONENT_TYPES SSOT
   * TypeScript enforces all cases are handled
   */
  
public buildComponentViewModel(
  fieldViewModel: FieldViewModel
): ComponentViewModel | null {

  // 1) Contract‑precheck (houdt deze methode klein & lint‑vriendelijk)
  if (!ensureOptionsIfRequired(fieldViewModel)) return null;

  // 2) Mapping van componentType → builder (vervangt de lange switch)
  const builders: Record<ComponentType, BuilderFn> = {
    [COMPONENT_TYPES.COUNTER]:        (vm) => this.buildCounter(vm),
    [COMPONENT_TYPES.CURRENCY]:       (vm) => this.buildCurrency(vm),
    [COMPONENT_TYPES.TEXT]:           (vm) => this.buildText(vm),
    [COMPONENT_TYPES.NUMBER]:         (vm) => this.buildNumber(vm),
    [COMPONENT_TYPES.CHIP_GROUP]:     (vm) => this.buildChipGroup(vm),
    [COMPONENT_TYPES.CHIP_GROUP_MULTIPLE]: (vm) => this.buildChipGroupMultiple(vm),
    [COMPONENT_TYPES.RADIO]:          (vm) => this.buildRadio(vm),
    [COMPONENT_TYPES.LABEL]:          (vm) => this.buildLabel(vm),
    [COMPONENT_TYPES.DATE]:           (vm) => this.buildDate(vm),
  };

  // 3) Dispatch in één regel
  const type = fieldViewModel.componentType as ComponentType;
  const build = builders[type];

  if (build === null || build === undefined) {
    // TypeScript exhaustiveness guard blijft intact via explicit fallback
    const exhaustiveCheck: never = type as never;
    console.warn(`Unknown component type: ${exhaustiveCheck}`);
    return null;
  }

  return build(fieldViewModel);
}


  /**
   * ═══════════════════════════════════════════════════════════
   * BUILD METHODS - One per component type
   * ═══════════════════════════════════════════════════════════
   */

  /**
   * BUILD COUNTER
   */
  private buildCounter(vm: FieldViewModel): CounterViewModel {
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.COUNTER,
      label: labelFromToken(vm.labelToken),
      value: this.ensureNumber(vm.value),
      error: vm.error,
      // DE REGELS WORDEN HIER GEDICTEERD:
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      errorStyle: Style.getErrorTextStyle(),
      onUpdate: (value: number) => {
        this.updateField(vm.fieldId, value);
      },
    };
  }

  /**
   * BUILD CURRENCY
   */
  private buildCurrency(vm: FieldViewModel): CurrencyViewModel {
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.CURRENCY,
      label: labelFromToken(vm.labelToken),
      value: this.ensureNumber(vm.value),
      placeholder: (typeof vm.placeholderToken === 'string' && vm.placeholderToken.length > 0) ? labelFromToken(vm.placeholderToken) : undefined,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onUpdate: (value: number) => {
        this.updateField(vm.fieldId, value);
      },
    };
  }

  /**
   * BUILD TEXT
   */
  private buildText(vm: FieldViewModel): TextViewModel {
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.TEXT,
      label: labelFromToken(vm.labelToken),
      value: this.ensureString(vm.value),
      placeholder: (typeof vm.placeholderToken === 'string' && vm.placeholderToken.length > 0) ? labelFromToken(vm.placeholderToken) : undefined,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onChangeText: (text: string) => {
        this.updateField(vm.fieldId, text);
      },
    };
  }

  /**
   * BUILD NUMBER
   */
  private buildNumber(vm: FieldViewModel): NumberViewModel {
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.NUMBER,
      label: labelFromToken(vm.labelToken),
      value: this.ensureNumber(vm.value),
      placeholder: (typeof vm.placeholderToken === 'string' && vm.placeholderToken.length > 0) ? labelFromToken(vm.placeholderToken) : undefined,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onChangeText: (value: number) => {
        this.updateField(vm.fieldId, value);
      },
    };
  }

  /**
   * BUILD CHIP GROUP (single select)
   * Pre-builds all chips with styles and callbacks
   */
  private buildChipGroup(vm: FieldViewModel): ChipGroupViewModel {
    const options = (vm.options ?? []) as readonly string[];
    const currentValue = vm.value as string | undefined;
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    // Pre-build all chips
    const chips = options.map((option) => 
      this.buildChip(option, currentValue === option, () => {
        this.updateField(vm.fieldId, option);
      })
    );

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.CHIP_GROUP,
      label: labelFromToken(vm.labelToken),
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      chipContainerStyle: Style.getChipContainerStyle(),
      chips,
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
    };
  }

  /**
   * BUILD CHIP GROUP MULTIPLE (multi select)
   * Includes toggle logic in callbacks
   */
  private buildChipGroupMultiple(vm: FieldViewModel): ChipGroupViewModel {
    const options = (vm.options ?? []) as readonly string[];
    const currentValues = Array.isArray(vm.value) ? vm.value : [];
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    const chips = options.map((option) => {
      const isSelected = currentValues.includes(option);
      
      return this.buildChip(option, isSelected, () => {
        // Toggle logic
        
// Toggle logic (type-safe)
const baseValues: string[] = Array.isArray(currentValues)
? (currentValues as unknown[]).filter((v): v is string => typeof v === 'string')
: [];
const newValues = isSelected ? baseValues.filter((v) => v !== option) : [...baseValues, option];
this.updateField(vm.fieldId, newValues);

      });
    });

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.CHIP_GROUP_MULTIPLE,
      label: labelFromToken(vm.labelToken),
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      chipContainerStyle: Style.getChipContainerStyle(),
      chips,
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
    };
  }

  /**
   * BUILD INDIVIDUAL CHIP
   * All style decisions made here
   */
  private buildChip(
    label: string,
    selected: boolean,
    onPress: () => void
  ): ChipViewModel {
    // Style logic - all conditionals resolved here
    const styles = Style.getChipStyle(selected);

    return {
      label,
      selected,
      containerStyle: styles.container,
      textStyle: styles.text,
      onPress,
      accessibilityLabel: label,
      accessibilityState: { selected },
    };
  }

  /**
   * BUILD RADIO (vertical single select)
   */
  private buildRadio(vm: FieldViewModel): RadioViewModel {
    const options = (vm.options ?? []) as readonly string[];
    const currentValue = vm.value as string | undefined;
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    const radioOptions: RadioOptionViewModel[] = options.map((option) => ({
      label: option,
      value: option,
      selected: currentValue === option,
      onSelect: () => {
        this.updateField(vm.fieldId, option);
      },
    }));

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.RADIO,
      label: labelFromToken(vm.labelToken),
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      radioContainerStyle: Style.getRadioContainerStyle(),
      options: radioOptions,
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
    };
  }

  /**
   * BUILD LABEL (read-only, derived value)
   */
  private buildLabel(vm: FieldViewModel): LabelViewModel {
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.LABEL,
      label: labelFromToken(vm.labelToken),
      value: String(vm.value ?? ''),
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      valueStyle: Style.getDerivedValueStyle(),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
    };
  }

  /**
   * BUILD DATE
   */
  private buildDate(vm: FieldViewModel): DateViewModel {
    const hasError = vm.error !== null && vm.error !== undefined && vm.error !== '';

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.DATE,
      label: labelFromToken(vm.labelToken),
      
      // 1. Vertaal String (uit State) naar Date (voor UI Picker)
      value: typeof vm.value === 'string' 
        ? isoDateOnlyToLocalNoon(vm.value) ?? new Date() : new Date(),
        
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      
      // 2. Vertaal Date (uit UI Picker) naar String (voor State)
      onChange: (date: Date) => {
        const isoString = toISOFromLocal(date);
        this.updateField(vm.fieldId, isoString);
      },
    };
  }

  /**
   * ═══════════════════════════════════════════════════════════
   * HELPER METHODS
   * ═══════════════════════════════════════════════════════════
   */

  /**
   * Type-safe conversion to number
   */
  private ensureNumber(value: unknown): number {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    return 0;
  }

  /**
   * Type-safe conversion to string
   */
  private ensureString(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }
    return '';
  }
}