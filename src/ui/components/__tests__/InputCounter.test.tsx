import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputCounter from '../fields/InputCounter';

describe('InputCounter', () => {
  const mockUpdate = jest.fn();

  it('roept onUpdate aan bij klik', () => {
    const { getByText } = render(
      <InputCounter label="Test" value={5} onUpdate={mockUpdate} />
    );
    fireEvent.press(getByText(' + '));
    expect(mockUpdate).toHaveBeenCalledWith(6);
  });
});