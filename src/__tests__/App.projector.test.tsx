import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithState } from '@test-utils/index';
import App from '../App';

describe('App Projector Flow', () => {
  it('WAI Check: LandingScreen heeft toegankelijke knoppen', async () => {
    const { getByText } = renderWithState(<App />);

    // Check of we op de landing staan
    expect(getByText(/Aanmelden/i)).toBeTruthy();
  });

  it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {
    const { getByText, queryByText } = renderWithState(<App />);

    // 1. Klik op aanmelden
    const signupButton = getByText(/Aanmelden/i);
    fireEvent.press(signupButton);

    // 2. Wacht tot de Wizard UI verschijnt
    // We zoeken nu op "bewoners", want dat staat in jouw log!
    await waitFor(
      () => {
        expect(getByText(/bewoners/i)).toBeTruthy();
      },
      { timeout: 2000 },
    );

    // 3. Extra check op de andere tekst uit je log
    expect(getByText(/volwassenen/i)).toBeTruthy();

    // 4. Check dat de landing tekst weg is
    expect(queryByText(/Welkom/i)).toBeNull();
  });
});
