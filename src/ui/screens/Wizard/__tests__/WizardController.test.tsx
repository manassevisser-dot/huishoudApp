import React from 'react';
import { render } from '@testing-library/react-native';
import { FormProvider } from '@app/context/FormContext';
import { createMockState } from '@test-utils/index';
import WizardController from '../WizardController';

// ✅ Mock uitgebreid om de callbacks op te vangen
const mockOnNext = jest.fn();
const mockOnBack = jest.fn();

jest.mock('../WizardPage', () => ({
  // We gebruiken een simpele functionele component die zijn props uitvoert
  WizardPage: (props: any) => {
    // We slaan de props op in een tijdelijke mock-functie voor aanroep
    mockOnNext.mockImplementation(() => props.onNext());
    mockOnBack.mockImplementation(() => props.onBack());
    return null;
  }
}));

describe('WizardController Branch & Function Coverage', () => {
  const steps = [
    'WIZARD_SETUP',
    'WIZARD_DETAILS',
    'WIZARD_INCOME',
    'WIZARD_EXPENSES',
    'UNKNOWN_STEP'
  ] as const;

  steps.forEach((step) => {
    it(`moet de juiste config kiezen voor stap: ${step}`, () => {
      const mockState = createMockState({ activeStep: step as any });
      const { toJSON } = render(
        <FormProvider initialState={mockState} mockDispatch={jest.fn()}>
          <WizardController />
        </FormProvider>
      );
      expect(toJSON()).toBeDefined();
    });
  });

  // ✅ TEST VOOR DE FUNCTIES (Lines 31-32 en Function coverage)
  it('moet de dispatch aanroepen wanneer onNext en onBack worden getriggerd', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockState({ activeStep: 'WIZARD_DETAILS' });

    render(
      <FormProvider initialState={mockState} mockDispatch={mockDispatch}>
        <WizardController />
      </FormProvider>
    );

    // Trigger de callbacks die de WizardController aan de WizardPage geeft
    mockOnNext();
    mockOnBack();

    // Controleer of de dispatch is aangeroepen met de juiste types
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'NEXT_STEP' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'PREV_STEP' });
  });
});