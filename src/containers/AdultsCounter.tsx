// src/containers/AdultsCounter.tsx
import * as React from 'react';
import { InputCounter } from '@ui/components/fields/InputCounter';
import { useForm } from '@app/context/FormContext';

/**
 * AdultsCounter (dumb):
 * - Leest via façade (valueProvider)
 * - Schrijft ruw via façade (dispatch FIELD_CHANGED)
 * - Geen validatie, geen min/max in UI (dat gebeurt upstream: adapter/boundary/reducer)
 */
export const AdultsCounter: React.FC = () => {
  const { state, dispatch } = useForm();

  // Huidige waarde (UI mag aannemen dat deze al valide/coerced is door boundary/reducer)
  const currentCount =
    state.data?.setup?.aantalVolwassen !== undefined
      ? state.data.setup.aantalVolwassen
      : 0;

  // Façade: alleen doorgeven; geen validatie, geen bounds
  const stateWriter = (nextValue: number) => {
    dispatch({
      type: 'FIELD_CHANGED',
      fieldId: 'aantalVolwassen',
      value: nextValue, // ruw doorgeven; boundary/coercion gebeurt upstream
    });
  };

  const valueProvider = {
    getValue: (_fieldId: string): unknown => currentCount,
  };

  return (
    <InputCounter
      fieldId="aantalVolwassen"
      valueProvider={valueProvider}
      stateWriter={stateWriter}
    />
  );
};

export default AdultsCounter;