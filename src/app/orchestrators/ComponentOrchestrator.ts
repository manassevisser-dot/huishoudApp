// src/app/orchestrators/ComponentOrchestrator.ts

import {
  ComponentViewModel,
  CounterViewModel,
  CurrencyViewModel,
  TextViewModel,
  NumberViewModel,
  ChipGroupViewModel,
  ChipViewModel,
  ToggleViewModel,
  RadioViewModel,
  RadioOptionViewModel,
  LabelViewModel,
  DateViewModel,
  COMPONENT_TYPES,
  ComponentType,
  getComponentMetadata,
} from '@domain/registry/ComponentRegistry';

import { FieldViewModel } from './interfaces/IUIOrchestrator';
import { labelFromToken } from '@domain/constants/labelResolver';
import { isoDateOnlyToLocalNoon, toISOFromLocal } from '@domain/helpers/DateHydrator';
import { ComponentStyleFactory as Style } from '@domain/styles/ComponentStyleFactory';
import { UiComponentStyles as UiStyles } from '@ui/styles/UiComponentStyles';

/**
 * COMPONENT ORCHESTRATOR
 * Taak: Het materialiseren van een FieldViewModel naar een ComponentViewModel.
 * Combineert ruwe data met domein-stijlregels en vertalingen.
 */

type BuilderFn = (vm: FieldViewModel) => ComponentViewModel;

const ensureOptionsIfRequired = (vm: FieldViewModel): boolean => {
  const metadata = getComponentMetadata(vm.componentType);
  if (metadata.requiresOptions === true && (vm.options === undefined || vm.options === null || vm.options.length === 0)) {
    console.warn(`Component ${vm.componentType} requires options but none provided for ${vm.fieldId}`);
    return false;
  }
  return true;
};

export type UpdateFieldCallback = (fieldId: string, value: unknown) => void;

export class ComponentOrchestrator {
  constructor(private readonly updateField: UpdateFieldCallback) {}

  public buildComponentViewModel(fieldViewModel: FieldViewModel): ComponentViewModel | null {
    if (!ensureOptionsIfRequired(fieldViewModel)) return null;

    const builders: Record<ComponentType, BuilderFn> = {
      [COMPONENT_TYPES.COUNTER]:      (vm) => this.buildCounter(vm),
      [COMPONENT_TYPES.CURRENCY]:     (vm) => this.buildCurrency(vm),
      [COMPONENT_TYPES.TEXT]:         (vm) => this.buildText(vm),
      [COMPONENT_TYPES.NUMBER]:       (vm) => this.buildNumber(vm),
      [COMPONENT_TYPES.CHIP_GROUP]:   (vm) => this.buildChipGroup(vm),
      [COMPONENT_TYPES.CHIP_GROUP_MULTIPLE]: (vm) => this.buildChipGroupMultiple(vm),
      [COMPONENT_TYPES.RADIO]:        (vm) => this.buildRadio(vm),
      [COMPONENT_TYPES.LABEL]:        (vm) => this.buildLabel(vm),
      [COMPONENT_TYPES.DATE]:         (vm) => this.buildDate(vm),
      [COMPONENT_TYPES.TOGGLE]:       (vm) => this.buildToggle(vm),
    };

    const build = builders[fieldViewModel.componentType];
    if (typeof build !== 'function'){
      console.warn(`unknown component type: ${fieldViewModel.componentType}`);
      return null;
    }

    return build(fieldViewModel);
  }

  // ── BUILD METHODS ──────────────────────────────────────────

  private buildCounter(vm: FieldViewModel): CounterViewModel {
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;
    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.COUNTER,
      label: labelFromToken(vm.labelToken),
      value: this.ensureNumber(vm.value),
      error: vm.error,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      errorStyle: Style.getErrorTextStyle(),
      onUpdate: (value: number) => this.updateField(vm.fieldId, value),
    };
  }

  private buildCurrency(vm: FieldViewModel): CurrencyViewModel {
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;
    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.CURRENCY,
      label: labelFromToken(vm.labelToken),
      value: this.ensureNumber(vm.value),
      placeholder: typeof vm.placeholderToken === 'string' && vm.placeholderToken.length > 0 ? labelFromToken(vm.placeholderToken) : undefined,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onUpdate: (value: number) => this.updateField(vm.fieldId, value),
    };
  }

  private buildText(vm: FieldViewModel): TextViewModel {
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;
    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.TEXT,
      label: labelFromToken(vm.labelToken),
      value: this.ensureString(vm.value),
      placeholder: typeof vm.placeholderToken === 'string' && vm.placeholderToken.length > 0 ? labelFromToken(vm.placeholderToken) : undefined,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onChangeText: (text: string) => this.updateField(vm.fieldId, text),
    };
  }

  private buildNumber(vm: FieldViewModel): NumberViewModel {
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;
    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.NUMBER,
      label: labelFromToken(vm.labelToken),
      value: this.ensureNumber(vm.value),
      placeholder: typeof vm.placeholderToken === 'string' && vm.placeholderToken.length > 0 ? labelFromToken(vm.placeholderToken) : undefined,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onChangeText: (value: number) => this.updateField(vm.fieldId, value),
    };
  }

  private buildChipGroup(vm: FieldViewModel): ChipGroupViewModel {
    const options = (vm.options ?? []) as readonly string[];
    const currentValue = vm.value as string | undefined;
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;

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
      chipContainerStyle: UiStyles.getChipContainerStyle(),
      chips,
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
    };
  }

  private buildChipGroupMultiple(vm: FieldViewModel): ChipGroupViewModel {
    const options = (vm.options ?? []) as readonly string[];
    const currentValues = Array.isArray(vm.value) ? vm.value : [];
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;

    const chips = options.map((option) => {
      const isSelected = currentValues.includes(option);
      return this.buildChip(option, isSelected, () => {
        const baseValues = Array.isArray(currentValues) ? currentValues.filter(v => typeof v === 'string') : [];
        const newValues = isSelected ? baseValues.filter(v => v !== option) : [...baseValues, option];
        this.updateField(vm.fieldId, newValues);
      });
    });

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.CHIP_GROUP_MULTIPLE,
      label: labelFromToken(vm.labelToken),
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      chipContainerStyle: UiStyles.getChipContainerStyle(),
      chips,
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
    };
  }

  private buildChip(label: string, selected: boolean, onPress: () => void): ChipViewModel {
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

  private buildRadio(vm: FieldViewModel): RadioViewModel {
    const options = (vm.options ?? []) as readonly string[];
    const currentValue = vm.value as string | undefined;
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;

    const radioOptions: RadioOptionViewModel[] = options.map((option) => ({
      label: option,
      value: option,
      selected: currentValue === option,
      onSelect: () => this.updateField(vm.fieldId, option),
    }));

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.RADIO,
      label: labelFromToken(vm.labelToken),
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      radioContainerStyle: UiStyles.getRadioContainerStyle(),
      options: radioOptions,
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
    };
  }

  private buildLabel(vm: FieldViewModel): LabelViewModel {
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;
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

  private buildDate(vm: FieldViewModel): DateViewModel {
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;
    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.DATE,
      label: labelFromToken(vm.labelToken),
      value: typeof vm.value === 'string' ? isoDateOnlyToLocalNoon(vm.value) ?? new Date() : new Date(),
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onChange: (date: Date) => this.updateField(vm.fieldId, toISOFromLocal(date)),
    };
  }

  private buildToggle(vm: FieldViewModel): ToggleViewModel {
    const options = (vm.options ?? []) as readonly string[];
    const hasError = typeof vm.error === 'string' && vm.error.length > 0;
    const labelTrue = options[0] ?? 'True';
    const labelFalse = options[1] ?? 'False';

    return {
      fieldId: vm.fieldId,
      componentType: COMPONENT_TYPES.TOGGLE,
      label: labelFromToken(vm.labelToken),
      value: vm.value === labelTrue,
      labelTrue,
      labelFalse,
      containerStyle: Style.getFieldContainer(hasError),
      labelStyle: Style.getLabelStyle(hasError),
      error: vm.error,
      errorStyle: Style.getErrorTextStyle(),
      onToggle: (newValue: boolean) => this.updateField(vm.fieldId, newValue ? labelTrue : labelFalse),
    };
  }

  private ensureNumber(value: unknown): number {
    if (typeof value === 'number' && !isNaN(value)) return value;
    return 0;
  }

  private ensureString(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }
}