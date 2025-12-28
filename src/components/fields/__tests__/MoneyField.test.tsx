import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MoneyField } from '../../fields/MoneyField';
import { ThemeProvider } from '@app/context/ThemeContext';
import * as FormContextModule from '@context/FormContext';

describe('MoneyField', () => {
  const mockUpdateField = jest.fn();
  const mockDispatch = jest.fn();
  const mockRefreshData = jest.fn();
  
  beforeEach(() => {
    jest.spyOn(FormContextModule, 'useFormContext').mockImplementation(() => ({
      state: { C7: { amount: 0 } } as any,
      updateField: mockUpdateField,
      dispatch: mockDispatch,        // FIX: Vereist door FormContextValue
      isRefreshing: false,           // FIX: Vereist door FormContextValue
      refreshData: mockRefreshData,  // FIX: Vereist door FormContextValue
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dispatches cents on blur (typ "12,34" → 1234)', () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <MoneyField pageId="C7" fieldId="amount" label="Bedrag" />
      </ThemeProvider>
    );

    const input = getByPlaceholderText('0,00');
    fireEvent.changeText(input, '12,34');
    fireEvent(input, 'blur');

    expect(mockUpdateField).toHaveBeenCalledWith('C7', 'amount', 1234);
  });
});