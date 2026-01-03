import * as React from 'react';
import InputCounter from '../ui/components/fields/InputCounter';
import { useForm } from '../app/context/FormContext';

export const AdultsCounter: React.FC = () => {
  const { state, dispatch } = useForm();
  const currentCount = state.data.setup?.aantalVolwassen ?? 1;

  const handleUpdate = (val: number) => {
    dispatch({
      type: 'SET_FIELD',
      payload: {
        section: 'setup',
        field: 'aantalVolwassen',
        value: val,
      },
    });
  };

  return (
    <InputCounter
      fieldId="aantalVolwassen"
      label="Aantal volwassenen"
      value={currentCount}
      onChange={(p) => handleUpdate(p.value)}
      min={1}
      max={10}
    />
  );
};

export default AdultsCounter;