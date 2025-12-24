import * as React from 'react';
import InputCounter from '../components/InputCounter';
import { useFormContext } from '@context/FormContext';

const AdultsCounter: React.FC = () => {
  // We halen nu 'updateField' op in plaats van 'dispatch'
  const { state, updateField } = useFormContext();
  const min = 1;
  const max = 10;

  const current = Number(state?.C1?.aantalVolwassen ?? min);

  const onValueChange = (next: number) => {
    const bounded = Math.max(min, Math.min(Math.floor(next), max));

    // 1. Update de primaire waarde in C1
    updateField('C1', 'aantalVolwassen', bounded);

    // 2. Business Rule [2025-12-07]: Huishoudens met > 5 volwassenen krijgen speciale status
    // We zetten dit direct in de root van de state (zoals gedefinieerd in onze FormState)
    const isSpecial = bounded > 5;
    updateField('global', 'isSpecialStatus', isSpecial);
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