import * as React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Navigator from '../navigation/Navigator';
import { FormState } from '../shared-types/form';

describe('WAI-009: Focus Management', () => {
  it('moet de juiste titels vinden via screen methods', async () => {
    const state = { activeStep: 'LANDING' } as any;
    const screen = render(<Navigator state={state} />);
    
    // Gebruik 'screen.getByText' in plaats van een losse variabele
    expect(screen.getByText(/Welkom/i)).toBeTruthy();

    screen.rerender(<Navigator state={{ ...state, activeStep: 'WIZARD' }} />);

    await waitFor(() => {
      // Zoek binnen de waitFor via de screen object
      expect(screen.getByRole('header')).toBeTruthy();
    });
  });
});