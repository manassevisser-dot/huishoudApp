import * as React from 'react';
import InputCounter from '../components/InputCounter';
import { useFormContext } from '../context/FormContext';
import { selectIsSpecialStatus } from '../selectors/householdSelectors';

const AdultsCounter: React.FC = () => {
  const { state, dispatch } = useFormContext();
  const min = 1;
  const max = 10;

  const current = Number(state?.C1?.aantalVolwassen ?? min);

  const onValueChange = (next: number) => {
    const bounded = Math.max(min, Math.min(Math.floor(next), max));

    dispatch({
      type: 'SET_PAGE_DATA',
      pageId: 'C1',
      data: { aantalVolwassen: bounded },
    });

    const nextState = {
      ...state,
      C1: { ...(state?.C1 ?? {}), aantalVolwassen: bounded },
    } as any;

    const special = selectIsSpecialStatus(nextState);
    dispatch({ type: 'SET_SPECIAL_STATUS', payload: special });
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
