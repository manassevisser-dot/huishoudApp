import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
// We gebruiken de krachtige render uit onze utils die de Provider bevat
import { render, makePhoenixState } from '../test-utils';
import LandingScreen from '@ui/screens/Wizard/LandingScreen';

/**
 * WAI-009 Focus Management & Phoenix Navigation Integration
 * Doel: Bevestigen dat de LandingScreen correct communiceert met de WizardContext
 * en de juiste navigatie-acties triggert in de nieuwe architectuur.
 */

describe('WAI-009 - LandingScreen Integration', () => {
  // We mocken dispatch om te kunnen spioneren op de acties
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('moet de LandingScreen renderen binnen de Phoenix-context', () => {
    // 1. Initialiseer de staat via onze factory
    const initialState = makePhoenixState({
      activeStep: 'LANDING',
      currentPageId: 'setup',
    });

    // 2. Render met de echte provider via onze custom render util
    render(<LandingScreen />, {
      state: initialState,
      dispatch: mockDispatch,
    });

    // 3. Controleer of de UI elementen zichtbaar zijn
    expect(screen.getByText(/Welkom/i)).toBeTruthy();
    expect(screen.getByText(/Start met het instellen/i)).toBeTruthy();
  });

  it('moet de juiste SET_STEP actie verzenden bij klikken op "Aanmelden"', () => {
    render(<LandingScreen />, {
      state: makePhoenixState({ activeStep: 'LANDING' }),
      dispatch: mockDispatch,
    });

    // Zoek de knop op de tekst (RTL best-practice)
    const signupButton = screen.getByText('Aanmelden');
    fireEvent.press(signupButton);

    // Controleer of de Phoenix-dispatch de juiste payload bevat
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STEP',
      payload: 'WIZARD',
    });
  });

  it('moet de juiste SET_STEP actie verzenden bij klikken op "Inloggen"', () => {
    render(<LandingScreen />, {
      state: makePhoenixState({ activeStep: 'LANDING' }),
      dispatch: mockDispatch,
    });

    const loginButton = screen.getByText('Inloggen');
    fireEvent.press(loginButton);

    // Controleer of we direct naar het DASHBOARD gaan
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STEP',
      payload: 'DASHBOARD',
    });
  });

  it('moet eventuele externe callbacks (onSignup) correct aanroepen', () => {
    const onSignupSpy = jest.fn();

    render(<LandingScreen onSignup={onSignupSpy} />, {
      dispatch: mockDispatch,
    });

    fireEvent.press(screen.getByText('Aanmelden'));

    // Zowel de lokale callback als de context dispatch moeten zijn afgegaan
    expect(onSignupSpy).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });
});
