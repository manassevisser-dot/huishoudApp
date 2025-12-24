/* global jest, describe, it, expect */
import * as React from 'react';
// ... rest van je imports
import { render, fireEvent } from '@testing-library/react-native';
import InputCounter from '../InputCounter';

// Mock de styles hook
jest.mock('../../styles/useAppStyles', () => ({
  useAppStyles: () => ({
    colors: {
      primary: 'blue',
      secondary: 'grey',
      textPrimary: 'black',
      primaryText: 'white',
      textSecondary: 'grey',
    },
  }),
}));

describe('WAI-002: InputCounter Unit Tests', () => {
  it('moet de initiële waarde tonen', () => {
    const { getByText } = render(<InputCounter value={3} onValueChange={() => {}} />);
    expect(getByText('3')).toBeTruthy();
  });

  it('moet onChange aanroepen bij verhogen', () => {
    const onChangeMock = jest.fn();
    const { getByLabelText } = render(<InputCounter value={3} onValueChange={onChangeMock} />);

    fireEvent.press(getByLabelText('Waarde verhogen'));
    expect(onChangeMock).toHaveBeenCalledWith(4);
  });

  it('mag niet onder het minimum gaan', () => {
    const onChangeMock = jest.fn();
    const { getByLabelText } = render(
      <InputCounter value={0} min={0} onValueChange={onChangeMock} />,
    );

    fireEvent.press(getByLabelText('Waarde verlagen'));
    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
