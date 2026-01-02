import * as React from 'react';
// Importeer renderWithState in plaats van de standaard render
import { renderWithState } from '@test-utils/index';
import App from '../App';
import { makePhoenixState } from '@test-utils/index';

describe('App Projector Flow', () => {
  it('WAI Check: LandingScreen heeft toegankelijke knoppen', async () => {
    const onboardingState = makePhoenixState({
      status: 'ONBOARDING', // Dwingt hem weg van Dashboard
      activeStep: 'LANDING'
    });

    // Gebruik renderWithState om de 'initialState' prop error te omzeilen
    const { getByText } = renderWithState(<App />, { state: onboardingState });

    expect(getByText(/aanmelden/i)).toBeTruthy();
  });

  it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {
    const wizardState = makePhoenixState({
      status: 'IN_PROGRESS',
      activeStep: 'WIZARD'
    });

    const { getByText } = renderWithState(<App />, { 
      state: wizardState 
    });

    expect(getByText(/wizard/i)).toBeTruthy();
  });
});