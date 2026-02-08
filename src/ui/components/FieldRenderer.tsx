// src/ui/components/FieldRenderer.tsx

import React from 'react';
import { View, Text } from 'react-native';
import type {
  ComponentViewModel,
  CounterViewModel,
  CurrencyViewModel,
  ChipGroupViewModel,
  TextViewModel,
  NumberViewModel,
  DateViewModel,
  LabelViewModel,
} from '../../domain/registry/ComponentRegistry';
import { COMPONENT_TYPES } from '../../domain/registry/ComponentRegistry';

// Component imports (default imports)
import InputCounter from './fields/InputCounter';
import MoneyInput from './fields/MoneyInput';
import ChipButton from './fields/ChipButton';
import FormField from './fields/FormField';
import DateField from './fields/DateField';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface FieldRendererProps {
  viewModel: ComponentViewModel;
}

// ─────────────────────────────────────────────
// FIELD RENDERER (ultra-dumb)
//
// Ontvangt 1 parameter: een volledig pre-computed ViewModel.
// Bevat GEEN logica, GEEN style-berekeningen, GEEN type casts.
// Alle beslissingen zijn al genomen door ComponentOrchestrator.
// ─────────────────────────────────────────────

export const FieldRenderer: React.FC<FieldRendererProps> = ({ viewModel }) => {
  return (
    <View>
      {renderComponent(viewModel)}

      {viewModel.error != null && viewModel.errorStyle != null && (
        <Text style={viewModel.errorStyle}>{viewModel.error}</Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────
// COMPONENT MAPPING (pure lookup, geen logica)
// ─────────────────────────────────────────────

function renderComponent(vm: ComponentViewModel): React.ReactElement | null {
  switch (vm.componentType) {
    case COMPONENT_TYPES.COUNTER:
      return renderCounter(vm);

    case COMPONENT_TYPES.CURRENCY:
      return renderCurrency(vm);

    case COMPONENT_TYPES.CHIP_GROUP:
    case COMPONENT_TYPES.CHIP_GROUP_MULTIPLE:
      return renderChipGroup(vm);

    case COMPONENT_TYPES.TEXT:
      return renderText(vm);

    case COMPONENT_TYPES.NUMBER:
      return renderNumber(vm);

    case COMPONENT_TYPES.DATE:
      return renderDate(vm);

    case COMPONENT_TYPES.LABEL:
      return renderLabel(vm);

    default:
      return null;
  }
}

// ─────────────────────────────────────────────
// RENDER FUNCTIONS (elk 1 parameter, nul logica)
// ─────────────────────────────────────────────

function renderCounter(vm: CounterViewModel): React.ReactElement {
  return (
    <View style={vm.containerStyle}>
      <Text style={vm.labelStyle}>{vm.label}</Text>
      <InputCounter value={vm.value} onUpdate={vm.onUpdate} />
    </View>
  );
}

function renderCurrency(vm: CurrencyViewModel): React.ReactElement {
  return (
    <View style={vm.containerStyle}>
      <Text style={vm.labelStyle}>{vm.label}</Text>
      <MoneyInput
        value={vm.value}
        onUpdate={vm.onUpdate}
        placeholder={vm.placeholder}
      />
    </View>
  );
}

function renderChipGroup(vm: ChipGroupViewModel): React.ReactElement {
  return (
    <View style={vm.containerStyle}>
      <Text style={vm.labelStyle}>{vm.label}</Text>
      <View style={vm.chipContainerStyle}>
        {vm.chips.map((chip) => (
          <ChipButton key={chip.label} viewModel={chip} />
        ))}
      </View>
    </View>
  );
}

function renderText(vm: TextViewModel): React.ReactElement {
  return (
    <View style={vm.containerStyle}>
      <Text style={vm.labelStyle}>{vm.label}</Text>
      <FormField
        value={vm.value}
        onChangeText={vm.onChangeText}
        placeholder={vm.placeholder}
      />
    </View>
  );
}

function renderNumber(vm: NumberViewModel): React.ReactElement {
  return (
    <View style={vm.containerStyle}>
      <Text style={vm.labelStyle}>{vm.label}</Text>
      <FormField
        value={String(vm.value)}
        onChangeText={(text) => vm.onUpdate(Number(text))}
        placeholder={vm.placeholder}
        keyboardType="numeric"
      />
    </View>
  );
}

function renderDate(vm: DateViewModel): React.ReactElement {
  return (
    <View style={vm.containerStyle}>
      <Text style={vm.labelStyle}>{vm.label}</Text>
      <DateField value={vm.value} onChangeDate={vm.onChangeDate} />
    </View>
  );
}

function renderLabel(vm: LabelViewModel): React.ReactElement {
  return (
    <View style={vm.containerStyle}>
      <Text style={vm.labelStyle}>{vm.label}</Text>
      <Text>{vm.value}</Text>
    </View>
  );
}

export default FieldRenderer;