import React from 'react';
import type { ComponentViewModel, TextViewModel, ToggleViewModel, CounterViewModel, DateViewModel } from '@domain/registry/ComponentRegistry';
import { COMPONENT_TYPES } from '@domain/registry/ComponentRegistry';

import InputCounter from './fields/InputCounter';
import MoneyInput from './fields/MoneyInput';
import ToggleSwitch from './fields/ToggleSwitch';
import DateField from './fields/DateField';

interface FieldRendererProps {
  viewModel: ComponentViewModel;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ viewModel }) => {
  switch (viewModel.componentType) {
    case 'toggle':
      return <ToggleSwitch viewModel={viewModel as ToggleViewModel} />;

    case COMPONENT_TYPES.COUNTER:
      return <InputCounter viewModel={viewModel as CounterViewModel} />;

    // Hier zat de fout: MoneyInput IS een TextInput, dus hij moet een TextViewModel krijgen.
    case COMPONENT_TYPES.CURRENCY:
    case COMPONENT_TYPES.TEXT:
    case COMPONENT_TYPES.NUMBER:
      return <MoneyInput viewModel={viewModel as TextViewModel} />;

    case COMPONENT_TYPES.DATE:
      return <DateField viewModel={viewModel as DateViewModel} />;

    default:
      return null;
  }
};

export default FieldRenderer;