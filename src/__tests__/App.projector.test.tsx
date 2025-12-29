import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Navigator from '../navigation/Navigator';
import { FormState } from '../shared-types/form';

// Mock de context en insets zodat de testomgeving stabiel is
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('Projector: Navigator & WAI Integriteit', () => {
  
  const createMockState = (step: 'LANDING' | 'WIZARD' | 'DASHBOARD'): FormState => ({
    activeStep: step,
    setup: { aantalVolwassen: 1 },
    household: { adultsCount: 1, members: [] },
    finance: { inkomsten: {}, uitgaven: {} }
  } as unknown as FormState);

  it('WAI Check: LandingScreen moet toegankelijke knoppen hebben', () => {
    const state = createMockState('LANDING');
    const { getByRole, getByLabelText } = render(<Navigator state={state} />);

    // WAI-01: Heeft de startknop de juiste rol en label voor schermlezers?
    const signupBtn = getByRole('button', { name: /aanmelden/i });
    expect(signupBtn).toBeTruthy();
    
    // WAI-02: Is het label specifiek genoeg?
    expect(getByLabelText('Aanmelden en starten met setup')).toBeTruthy();
  });

  it('Projector: Moet naar Wizard switchen bij actie', async () => {
    // We testen hier of de Navigator de switch-case logica correct uitvoert
    const { rerender, getByText } = render(<Navigator state={createMockState('LANDING')} />);
    
    expect(getByText(/Welkom/i)).toBeTruthy();

    // Simuleer een state-update vanuit de orchestrator
    rerender(<Navigator state={createMockState('WIZARD')} />);
    
    // Nu moet de WizardPage getoond worden (ervan uitgaande dat die 'Stappen' bevat)
    await waitFor(() => {
      expect(getByText(/Stap/i)).toBeTruthy();
    });
  });

  it('WAI Check: Dashboard moet direct bereikbaar zijn via Inloggen', () => {
    const state = createMockState('DASHBOARD');
    const { getByText } = render(<Navigator state={state} />);

    // Controleer of de "Dashboard (Hoofdmenu)" tekst aanwezig is
    expect(getByText(/Dashboard/i)).toBeTruthy();
  });
});