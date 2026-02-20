/**
 * @file_intent Assembleert UI `primitives` tot complete, functionele "Entry" componenten (bv. `MoneyEntry`, `TextEntry`). Deze componenten zijn de daadwerkelijke input-velden die de gebruiker in de UI ziet.
 * @repo_architecture UI Layer - Component Library. Dit bestand is de brug tussen de kale primitieven en de door de domeinlaag gedefinieerde `ViewModels`.
 * @term_definition
 *   - `Entry Component`: Een `memoized` React-component die een specifieke `ViewModel` accepteert en een `primitive` rendert binnen een `FieldWrapper`. Voorbeeld: `MoneyEntry` neemt een `CurrencyViewModel` en rendert een `InputPrimitive`.
 *   - `FieldWrapper`: Een interne HOC (Higher-Order Component) die de standaard layout voor een veld verzorgt, inclusief een label, het input-element zelf, en een ruimte voor een foutmelding.
 * @contract Elk `Entry` component is `memoized` voor performance en accepteert één enkele prop: `viewModel`. Dit `viewModel` (afkomstig uit de domain-laag) bevat alle data, stijlen en callbacks die nodig zijn om het component te renderen en te laten functioneren. Het bestand exporteert een set van deze `Entry`-componenten.
 * @ai_instruction Gebruik deze `Entry`-componenten in je schermen om data-invoer van de gebruiker te verzamelen. De logica en state worden volledig beheerd door de `ViewModel` die je aan het component meegeeft. Voeg hier een nieuw `Entry`-component toe wanneer er een nieuw type data-invoer nodig is dat niet gedekt wordt door de bestaande componenten.
 */
// src/ui/fields/fields.tsx
import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { AnyStyle } from '@ui/styles/PlatformStyles';
import { 
  InputPrimitive, 
  CounterPrimitive, 
  TogglePrimitive, 
  ChipPrimitive, 
  RadioOptionPrimitive, 
  DatePrimitive,
  LabelPrimitive 
} from '../primitives/primitives';
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
  BasePrimitiveViewModel
} from '@domain/registry/PrimitiveRegistry';

/**
 * FieldWrapper: Gebruikt uitsluitend stijlen uit het domein.
 */
const FieldWrapper = ({ 
  viewModel, 
  children 
}: { 
  viewModel: BasePrimitiveViewModel & { label?: string; labelStyle?: AnyStyle; containerStyle?: AnyStyle; errorStyle?: AnyStyle }; 
  children: React.ReactNode 
}) => (
  <View style={viewModel.containerStyle}>
    {typeof viewModel.label === 'string' && viewModel.label.length > 0 && ( <Text style={viewModel.labelStyle}>{viewModel.label}</Text>)}
    {children}
    {typeof viewModel.error === 'string' && viewModel.error.length > 0 && ( <Text style={viewModel.errorStyle}>{viewModel.error}</Text>)}
  </View>
);

// --- MONEY ENTRY ---
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

// --- DATE ENTRY ---
// Toevoegen aan fields.tsx
export const DateEntry = memo(({ viewModel }: { viewModel: DateViewModel }) => (
    <FieldWrapper viewModel={viewModel}>
      <DatePrimitive 
        value={viewModel.value?.toString()} // Of een andere string-formatie die je domein wenst
        onDateChange={viewModel.onDateChange}
        style={viewModel.containerStyle}
      />
    </FieldWrapper>
  ));
  
// --- TEXT ENTRY ---
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

// --- NUMBER ENTRY ---
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

// --- COUNTER ENTRY ---
export const CounterEntry = memo(({ viewModel }: { viewModel: CounterViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <CounterPrimitive 
      value={viewModel.value}
      onCounterChange={viewModel.onCounterChange}
      style={viewModel.containerStyle}
    />
  </FieldWrapper>
));

// --- TOGGLE ENTRY ---
export const ToggleEntry = memo(({ viewModel }: { viewModel: ToggleViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <TogglePrimitive 
      value={viewModel.value}
      onToggle={viewModel.onToggle}
      style={viewModel.containerStyle}
    />
  </FieldWrapper>
));

// --- CHIP GROUP ENTRY ---
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

// --- RADIO ENTRY ---
export const RadioEntry = memo(({ viewModel }: { viewModel: RadioViewModel }) => (
  <FieldWrapper viewModel={viewModel}>
    <View style={viewModel.radioContainerStyle}>
      {viewModel.options.map((option, index) => (
        <RadioOptionPrimitive 
          key={index}
          label={option.label}
          selected={option.selected}
          onSelect={option.onSelect}
        />
      ))}
    </View>
  </FieldWrapper>
));

// --- LABEL ENTRY ---
export const LabelEntry = memo(({ viewModel }: { viewModel: LabelViewModel }) => (
  <LabelPrimitive 
    label={viewModel.label}
    value={viewModel.value}
    style={viewModel.containerStyle}
    labelStyle={viewModel.labelStyle}
    valueStyle={viewModel.valueStyle}
  />
));