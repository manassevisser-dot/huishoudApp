import * as React from 'react';
import InputCounter from '@components/InputCounter';
import { useForm } from '@app/context/FormContext';

const AdultsCounter: React.FC<any> = () => {
  // We halen nu 'dispatch' op in plaats van 'dispatch'
  const { state, dispatch } = useForm() as any;
  const min = 1;
  const max = 10;

  const current = Number(state?.C1?.aantalVolwassen ?? min);

  const onValueChange = (next: number) => {
    const bounded = Math.max(min, Math.min(Math.floor(next), max));

    // 1. Update de primaire waarde in C1
    dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: 'C1', value: 'aantalVolwassen', bounded } });

    // 2. Business Rule [2025-12-07]: Huishoudens met > 5 volwassenen krijgen speciale status
    // We zetten dit direct in de root van de state (zoals gedefinieerd in onze FormState)
    const isSpecial = bounded > 5;
    dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: 'global', value: 'isSpecialStatus', isSpecial } });
  };

  return (
    <InputCounter
      value={current}
      min={min}
      max={max}
      onValueChange={onValueChange}
      accessibilityLabel="Aantal volwassenen"
    />
  );
};

export default AdultsCounter;
