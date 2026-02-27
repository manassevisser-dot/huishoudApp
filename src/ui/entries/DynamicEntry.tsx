/**
 * Router-component dat een `RenderEntryVM` naar de juiste entry-component stuurt.
 *
 * @module ui/entries
 * @see {@link ./README.md | Entries — Details}
 *
 * @remarks
 * `DynamicEntry` is de enige plek in de entry-keten die `useAppStyles()` aanroept.
 * Het styles-object wordt als parameter aan `renderByPrimitive` en alle mappers
 * doorgegeven, zodat stijlresolutie altijd in de React-context plaatsvindt.
 *
 * @example
 * <DynamicEntry entry={renderEntryVM} />
 */
import React, { memo } from 'react';
import { PRIMITIVE_TYPES } from '@ui/kernel';
import { DynamicPrimitive } from '@ui/primitives/primitives';
import { useAppStyles } from '@ui/styles/useAppStyles';
import type { AppStyles } from '@ui/styles/useAppStyles';
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

const renderByPrimitive = (entry: RenderEntryVM, styles: AppStyles): React.ReactElement | null => {
  switch (entry.primitiveType) {
    case PRIMITIVE_TYPES.CURRENCY:
      return <MoneyEntry viewModel={toCurrencyViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.DATE:
      return <DateEntry viewModel={toDateViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.TEXT:
      return <TextEntry viewModel={toTextViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.NUMBER:
      return <NumberEntry viewModel={toNumberViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.COUNTER:
      return <CounterEntry viewModel={toCounterViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.TOGGLE:
      return <ToggleEntry viewModel={toToggleViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.CHIP_GROUP:
    case PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE:
      return <ChipGroupEntry viewModel={toChipGroupViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.RADIO:
      return <RadioEntry viewModel={toRadioViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.LABEL:
      return <LabelEntry viewModel={toLabelViewModel(entry, styles)} />;
    case PRIMITIVE_TYPES.ACTION:
      return <ActionEntry viewModel={toActionViewModel(entry, styles)} />;
    default:
      return <DynamicPrimitive primitiveType={entry.primitiveType} props={{ value: entry.value, onAction: entry.onChange }} />;
  }
};

export const DynamicEntry = memo(({ entry }: { entry: RenderEntryVM }) => {
  const { styles } = useAppStyles();

  if (entry.isVisible !== true) {
    return null;
  }
  return renderByPrimitive(entry, styles);
});
