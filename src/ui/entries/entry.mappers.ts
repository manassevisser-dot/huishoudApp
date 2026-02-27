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
import {
  getEmptyStyle,
  toStyleRule,
  toStringValue,
  toNumberValue,
  toBooleanValue,
  toBaseViewModel,
} from './entry.helpers';

export const toCurrencyViewModel = (entry: RenderEntryVM): CurrencyViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.CURRENCY),
  label: entry.label,
  value: toStringValue(entry.value),
  placeholder: entry.placeholder,
  containerStyle: toStyleRule(entry.childStyle),
  labelStyle: toStyleRule(entry.style),
  onCurrencyChange: (value: string) => entry.onChange(value),
});

export const toDateViewModel = (entry: RenderEntryVM): DateViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.DATE),
  label: entry.label,
  value: toStringValue(entry.value),
  containerStyle: toStyleRule(entry.childStyle),
  labelStyle: toStyleRule(entry.style),
  onDateChange: (value: string) => entry.onChange(value),
});

export const toTextViewModel = (entry: RenderEntryVM): TextViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.TEXT),
  label: entry.label,
  value: toStringValue(entry.value),
  placeholder: entry.placeholder,
  containerStyle: toStyleRule(entry.childStyle),
  labelStyle: toStyleRule(entry.style),
  onTextChange: (value: string) => entry.onChange(value),
});

export const toNumberViewModel = (entry: RenderEntryVM): NumberViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.NUMBER),
  label: entry.label,
  value: toStringValue(entry.value),
  placeholder: entry.placeholder,
  containerStyle: toStyleRule(entry.childStyle),
  labelStyle: toStyleRule(entry.style),
  onNumberChange: (value: string) => entry.onChange(value),
});

export const toCounterViewModel = (entry: RenderEntryVM): CounterViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.COUNTER),
  label: entry.label,
  value: toNumberValue(entry.value),
  containerStyle: toStyleRule(entry.childStyle),
  labelStyle: toStyleRule(entry.style),
  onCounterChange: (value: number) => entry.onChange(value),
});

export const toToggleViewModel = (entry: RenderEntryVM): ToggleViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.TOGGLE),
  label: entry.label,
  value: toBooleanValue(entry.value),
  labelTrue: 'Ja',
  labelFalse: 'Nee',
  containerStyle: toStyleRule(entry.childStyle),
  labelStyle: toStyleRule(entry.style),
  onToggle: (value: boolean) => entry.onChange(value),
});

export const toChipGroupViewModel = (entry: RenderEntryVM): ChipGroupViewModel => {
  const selected = toStringValue(entry.value);
  const options = entry.options ?? [];
  const empty = getEmptyStyle();

  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.CHIP_GROUP),
    label: entry.label,
    containerStyle: toStyleRule(entry.style),
    labelStyle: empty,
    chipContainerStyle: toStyleRule(entry.childStyle),
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

export const toRadioViewModel = (entry: RenderEntryVM): RadioViewModel => {
  const selected = toStringValue(entry.value);
  const options = entry.options ?? [];

  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.RADIO),
    label: entry.label,
    containerStyle: toStyleRule(entry.style),
    labelStyle: getEmptyStyle(),
    radioContainerStyle: toStyleRule(entry.childStyle),
    options: options.map((option) => ({
      label: option,
      value: option,
      selected: option === selected,
      onSelect: () => entry.onChange(option),
    })),
  };
};

export const toActionViewModel = (entry: RenderEntryVM): ActionViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.ACTION),
  label: entry.label,
  containerStyle: toStyleRule(entry.style),
  onPress: () => { entry.onChange(null); },
});

export const toLabelViewModel = (entry: RenderEntryVM): LabelViewModel => ({
  ...toBaseViewModel(entry, PRIMITIVE_TYPES.LABEL),
  label: entry.label,
  value: toStringValue(entry.value),
  containerStyle: toStyleRule(entry.style),
  labelStyle: getEmptyStyle(),
  valueStyle: toStyleRule(entry.childStyle),
});
