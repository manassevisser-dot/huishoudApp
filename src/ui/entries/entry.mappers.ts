/**
 * Pure mapper-functies die een `RenderEntryVM` omzetten naar een getypt PrimitiveViewModel.
 *
 * @module ui/entries
 * @see {@link ./README.md | Entries — Details}
 *
 * @remarks
 * Elke mapper ontvangt `styles: AppStyles` als tweede argument en geeft dit door aan
 * `toStyleRule`, zodat style-sleutels van de identity-resolver correct worden omgezet
 * naar echte React Native stijlobjecten. Stijlresolutie vindt uitsluitend in de UI-laag
 * plaats — nooit in de orchestrator- of domeinlaag.
 */
import { PRIMITIVE_TYPES } from '@ui/kernel';
import type {
  CurrencyViewModel,
  DateViewModel,
  TextViewModel,
  NumberViewModel,
  CounterViewModel,
  ToggleViewModel,
  ChipGroupViewModel,
  RadioViewModel,
  LabelViewModel,
  ActionViewModel,
} from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import type { AppStyles } from '@ui/styles/useAppStyles';
import {
  getEmptyStyle,
  toStyleRule,
  toStringValue,
  toNumberValue,
  toBooleanValue,
  toBaseViewModel,
} from './entry.helpers';

export const toCurrencyViewModel = (entry: RenderEntryVM, styles: AppStyles): CurrencyViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.CURRENCY),
  label: entry.label,
  value: toStringValue(entry.value),
  placeholder: entry.placeholder,
  containerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
  labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
  onCurrencyChange: (value: string) => entry.onChange(value),
});

export const toDateViewModel = (entry: RenderEntryVM, styles: AppStyles): DateViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.DATE),
  label: entry.label,
  value: toStringValue(entry.value),
  containerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
  labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
  onDateChange: (value: string) => entry.onChange(value),
});

export const toTextViewModel = (entry: RenderEntryVM, styles: AppStyles): TextViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.TEXT),
  label: entry.label,
  value: toStringValue(entry.value),
  placeholder: entry.placeholder,
  containerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
  labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
  onTextChange: (value: string) => entry.onChange(value),
});

export const toNumberViewModel = (entry: RenderEntryVM, styles: AppStyles): NumberViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.NUMBER),
  label: entry.label,
  value: toStringValue(entry.value),
  placeholder: entry.placeholder,
  containerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
  labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
  onNumberChange: (value: string) => entry.onChange(value),
});

export const toCounterViewModel = (entry: RenderEntryVM, styles: AppStyles): CounterViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.COUNTER),
  label: entry.label,
  value: toNumberValue(entry.value),
  containerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
  labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
  onCounterChange: (value: number) => entry.onChange(value),
});

export const toToggleViewModel = (entry: RenderEntryVM, styles: AppStyles): ToggleViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.TOGGLE),
  label: entry.label,
  value: toBooleanValue(entry.value),
  labelTrue: 'Ja',
  labelFalse: 'Nee',
  containerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
  labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
  onToggle: (value: boolean) => entry.onChange(value),
});

export const toChipGroupViewModel = (entry: RenderEntryVM, styles: AppStyles): ChipGroupViewModel => {
  const selected = toStringValue(entry.value);
  const options = entry.options ?? [];
  const empty = getEmptyStyle();

  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.CHIP_GROUP),
    label: entry.label,
    containerStyle: toStyleRule(entry.style, styles, 'inputContainer'),
    labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
    chipContainerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
    chips: options.map((option) => {
      const isSelected = option === selected;
      return {
        label: option,
        selected: isSelected,
        containerStyle: empty,
        textStyle: empty,
        onPress: () => entry.onChange(option),
        accessibilityLabel: option,
        accessibilityState: { selected: isSelected },
      };
    }),
  };
};

export const toRadioViewModel = (entry: RenderEntryVM, styles: AppStyles): RadioViewModel => {
  const selected = toStringValue(entry.value);
  const options = entry.options ?? [];

  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.RADIO),
    label: entry.label,
    containerStyle: toStyleRule(entry.style, styles, 'inputContainer'),
    labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
    radioContainerStyle: toStyleRule(entry.childStyle, styles, 'inputContainer'),
    options: options.map((option) => ({
      label: option,
      value: option,
      selected: option === selected,
      onSelect: () => entry.onChange(option),
    })),
  };
};

export const toActionViewModel = (entry: RenderEntryVM, styles: AppStyles): ActionViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.ACTION),
  label: entry.label,
  containerStyle: toStyleRule(entry.style, styles, 'inputContainer'),
  onPress: () => { entry.onChange(null); },
});

export const toLabelViewModel = (entry: RenderEntryVM, styles: AppStyles): LabelViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.LABEL),
  label: entry.label,
  value: toStringValue(entry.value),
  containerStyle: toStyleRule(entry.style, styles, 'inputContainer'),
  labelStyle: toStyleRule(entry.style, styles, 'entryLabel'),
  valueStyle: toStyleRule(entry.childStyle, styles, 'entryLabel'),
});
