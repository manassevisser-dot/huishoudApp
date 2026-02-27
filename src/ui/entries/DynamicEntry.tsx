import React, { memo } from 'react';
import { PRIMITIVE_TYPES } from '@ui/kernel';
import { DynamicPrimitive } from '@ui/primitives/primitives';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import {
  MoneyEntry,
  DateEntry,
  TextEntry,
  NumberEntry,
  CounterEntry,
  ToggleEntry,
  ChipGroupEntry,
  RadioEntry,
  LabelEntry,
  ActionEntry,
} from './entries.components';
import {
  toCurrencyViewModel,
  toDateViewModel,
  toTextViewModel,
  toNumberViewModel,
  toCounterViewModel,
  toToggleViewModel,
  toChipGroupViewModel,
  toRadioViewModel,
  toLabelViewModel,
  toActionViewModel,
} from './entry.mappers';

const renderByPrimitive = (entry: RenderEntryVM): React.ReactElement | null => {
  switch (entry.primitiveType) {
    case PRIMITIVE_TYPES.CURRENCY:
      return <MoneyEntry viewModel={toCurrencyViewModel(entry)} />;
    case PRIMITIVE_TYPES.DATE:
      return <DateEntry viewModel={toDateViewModel(entry)} />;
    case PRIMITIVE_TYPES.TEXT:
      return <TextEntry viewModel={toTextViewModel(entry)} />;
    case PRIMITIVE_TYPES.NUMBER:
      return <NumberEntry viewModel={toNumberViewModel(entry)} />;
    case PRIMITIVE_TYPES.COUNTER:
      return <CounterEntry viewModel={toCounterViewModel(entry)} />;
    case PRIMITIVE_TYPES.TOGGLE:
      return <ToggleEntry viewModel={toToggleViewModel(entry)} />;
    case PRIMITIVE_TYPES.CHIP_GROUP:
    case PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE:
      return <ChipGroupEntry viewModel={toChipGroupViewModel(entry)} />;
    case PRIMITIVE_TYPES.RADIO:
      return <RadioEntry viewModel={toRadioViewModel(entry)} />;
    case PRIMITIVE_TYPES.LABEL:
      return <LabelEntry viewModel={toLabelViewModel(entry)} />;
    case PRIMITIVE_TYPES.ACTION:
      return <ActionEntry viewModel={toActionViewModel(entry)} />;
    default:
      return <DynamicPrimitive primitiveType={entry.primitiveType} props={{ value: entry.value, onAction: entry.onChange }} />;
  }
};

export const DynamicEntry = memo(({ entry }: { entry: RenderEntryVM }) => {
  if (entry.isVisible !== true) {
    return null;
  }
  return renderByPrimitive(entry);
});
