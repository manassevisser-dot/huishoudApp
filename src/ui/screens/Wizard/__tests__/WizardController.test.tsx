import React from 'react';
import { render } from '@testing-library/react-native';
import { FormProvider } from '@app/context/FormContext';
import { createMockState } from '@test-utils/index';
import WizardController from '../WizardController';
import { WizardPage } from '../WizardPage';

// We mocken de WizardPage om te inspecteren welke props hij krijgt
jest.mock('../WizardPage', () => ({
  WizardPage: jest.fn(() => null)
}));

describe('WizardController Branch & Function Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const steps = [
    { step: 'WIZARD_SETUP', expectedId: 'household_setup' },
    { step: 'WIZARD_DETAILS', expectedId: 'household_details' },
    { step: 'WIZARD_INCOME', expectedId: 'income_details' },
    { step: 'WIZARD_EXPENSES', expectedId: 'fixed_expenses' },
  ];

  steps.forEach(({ step, expectedId }) => {
    it(`moet de juiste config kiezen voor stap: ${step}`, () => {
      const mockState = createMockState({ activeStep: step as any });
      
      render(
        <FormProvider initialState={mockState} mockDispatch={jest.fn()}>
          <WizardController />
        </FormProvider>
      );

      const calls = (WizardPage as any).mock.calls;
      const props = calls[calls.length - 1][0];

      expect(props).toEqual(
        expect.objectContaining({
          config: expect.objectContaining({ 
            pageId: expectedId 
          })
        })
      );
    });
  });
  
  it('moet veld-updates verwerken via de stateWriter...', () => {
    const mockState = createMockState({ 
      activeStep: 'WIZARD_SETUP',
      data: { setup: { aantalMensen: 1 } } 
    });

    render(
      <FormProvider initialState={mockState} mockDispatch={jest.fn()}>
        <WizardController />
      </FormProvider>
    );

    const allCalls = (WizardPage as jest.Mock).mock.calls;
    const lastProps = allCalls[allCalls.length - 1][0];
    
    // Verify stateWriter exists and has updateField method
    expect(lastProps.stateWriter).toBeDefined();
    expect(typeof lastProps.stateWriter.updateField).toBe('function');
    
    // Test that updateField doesn't throw
    expect(() => {
      lastProps.stateWriter.updateField('aantalMensen', 5);
    }).not.toThrow();
  });

  it('moet validatie kunnen uitvoeren via de stateWriter', () => {
    const mockState = createMockState({ activeStep: 'WIZARD_SETUP' });

    render(
      <FormProvider initialState={mockState} mockDispatch={jest.fn()}>
        <WizardController />
      </FormProvider>
    );

    const lastCallProps = (WizardPage as any).mock.calls[0][0];
    
    // De orchestrator moet de validate methode aanbieden
    expect(typeof lastCallProps.validate).toBe('function');
  });
});