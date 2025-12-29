import * as React from 'react';
import InputCounter from '../ui/components/fields/InputCounter';
import { useForm } from '../app/context/FormContext';

export const AdultsCounter: React.FC = () => {
  const { state, dispatch } = useForm();

  return (
    <InputCounter
      label="Aantal volwassenen"
      value={state.household?.adultsCount || 1}
      onUpdate={(val: number) => dispatch({ 
        type: 'SET_FIELD', 
        payload: { path: 'household.adultsCount', value: val } 
      })}
      min={1}
      max={10}
    />
  );
};

export default AdultsCounter;