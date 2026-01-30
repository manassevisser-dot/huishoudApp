import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithState } from 'src/test-utils/render/renderers';
import { InputCounter } from 'src/ui/components/fields/InputCounter';

describe('InputCounter Integrity', () => {
  // De component verwacht een simpele functie: (value: number) => void
  const mockStateWriter = jest.fn();

  beforeEach(() => {
    // Reset de mock voor elke test zodat oude aanroepen niet meetellen
    mockStateWriter.mockClear();
  });

  test('zou de initiële waarde moeten tonen', async () => {
    renderWithState(
      <InputCounter 
        fieldId="setup.aantalMensen" 
        value={5} 
        stateWriter={mockStateWriter} 
      />
    );

    const counterValue = screen.getByTestId('counter-value');
    // We zetten het om naar string omdat props.children soms een getal is
    expect(counterValue.props.children.toString()).toBe('5');
  });

  test('plus knop verhoogt de waarde via de stateWriter', () => {
    renderWithState(
      <InputCounter 
        fieldId="setup.aantalMensen" 
        value={5} 
        stateWriter={mockStateWriter} 
      />
    );

    const plusButton = screen.getByTestId('counter-increment');
    fireEvent.press(plusButton);

    // De component berekent 5 + 1 en stuurt dit naar de functie
    expect(mockStateWriter).toHaveBeenCalledWith(6);
  });

  test('min knop verlaagt de waarde via de stateWriter', () => {
    renderWithState(
      <InputCounter 
        fieldId="setup.aantalMensen" 
        value={5} 
        stateWriter={mockStateWriter} 
      />
    );

    const minusButton = screen.getByTestId('counter-decrement');
    fireEvent.press(minusButton);

    // De component berekent 5 - 1 en stuurt dit naar de functie
    expect(mockStateWriter).toHaveBeenCalledWith(4);
  });
});