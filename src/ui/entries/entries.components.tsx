import React, { memo } from 'react';
import { View, Text } from 'react-native';
import type { AnyStyle } from '@ui/styles/PlatformStyles';
import {
  InputPrimitive,
  CounterPrimitive,
  TogglePrimitive,
  ChipPrimitive,
  RadioOptionPrimitive,
  DatePrimitive,
  LabelPrimitive,
  ButtonPrimitive,
} from '@ui/primitives/primitives';
import type {
  CurrencyViewModel,
  TextViewModel,
  NumberViewModel,
  CounterViewModel,
  ToggleViewModel,
  ChipGroupViewModel,
  RadioViewModel,
  LabelViewModel,
  DateViewModel,
  ActionViewModel,
  BasePrimitiveViewModel,
} from '@ui/kernel';

const FieldWrapper = ({
  viewModel,
  children,
}: {
  viewModel: BasePrimitiveViewModel & {
    label?: string;
    labelStyle?: AnyStyle;
    containerStyle?: AnyStyle;
    errorStyle?: AnyStyle;
  };
  children: React.ReactNode;
}) => (
  <View style={viewModel.containerStyle}>
    {typeof viewModel.label === 'string' && viewModel.label.length > 0 && (
      <Text style={viewModel.labelStyle}>{viewModel.label}</Text>
    )}
    {children}
    {typeof viewModel.error === 'string' && viewModel.error.length > 0 && (
      <Text style={viewModel.errorStyle}>{viewModel.error}</Text>
    )}
  </View>
);

export const MoneyEntry = memo(({ viewModel }: { viewModel: CurrencyViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <InputPrimitive
      value={viewModel.value}
      onAction={viewModel.onCurrencyChange}
      placeholder={viewModel.placeholder}
      keyboardType="decimal-pad"
      style={viewModel.containerStyle}
    />
  </FieldWrapper>
));

export const DateEntry = memo(({ viewModel }: { viewModel: DateViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <DatePrimitive
      value={viewModel.value?.toString()}
      onDateChange={viewModel.onDateChange}
      style={viewModel.containerStyle}
    />
  </FieldWrapper>
));

export const TextEntry = memo(({ viewModel }: { viewModel: TextViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <InputPrimitive
      value={viewModel.value}
      onAction={viewModel.onTextChange}
      placeholder={viewModel.placeholder}
      style={viewModel.containerStyle}
    />
  </FieldWrapper>
));

export const NumberEntry = memo(({ viewModel }: { viewModel: NumberViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <InputPrimitive
      value={viewModel.value}
      onAction={viewModel.onNumberChange}
      placeholder={viewModel.placeholder}
      keyboardType="numeric"
      style={viewModel.containerStyle}
    />
  </FieldWrapper>
));

export const CounterEntry = memo(({ viewModel }: { viewModel: CounterViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <CounterPrimitive
      value={viewModel.value}
      onCounterChange={viewModel.onCounterChange}
      style={viewModel.containerStyle}
    />
  </FieldWrapper>
));

export const ToggleEntry = memo(({ viewModel }: { viewModel: ToggleViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <TogglePrimitive value={viewModel.value} onToggle={viewModel.onToggle} style={viewModel.containerStyle} />
  </FieldWrapper>
));

export const ChipGroupEntry = memo(({ viewModel }: { viewModel: ChipGroupViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <View style={viewModel.chipContainerStyle}>
      {viewModel.chips.map((chip, index) => (
        <ChipPrimitive
          key={index}
          label={chip.label}
          selected={chip.selected}
          onPress={chip.onPress}
          containerStyle={chip.containerStyle}
          textStyle={chip.textStyle}
          accessibilityLabel={chip.accessibilityLabel}
        />
      ))}
    </View>
  </FieldWrapper>
));

export const RadioEntry = memo(({ viewModel }: { viewModel: RadioViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <View style={viewModel.radioContainerStyle}>
      {viewModel.options.map((option, index) => (
        <RadioOptionPrimitive key={index} label={option.label} selected={option.selected} onSelect={option.onSelect} />
      ))}
    </View>
  </FieldWrapper>
));

export const ActionEntry = memo(({ viewModel }: { viewModel: ActionViewModel }) => (
  <ButtonPrimitive
    label={viewModel.label}
    onPress={viewModel.onPress}
    style={viewModel.containerStyle}
  />
));

export const LabelEntry = memo(({ viewModel }: { viewModel: LabelViewModel }) => (
  <LabelPrimitive
    label={viewModel.label}
    value={viewModel.value}
    style={viewModel.containerStyle}
    labelStyle={viewModel.labelStyle}
    valueStyle={viewModel.valueStyle}
  />
));
