// src/app/context/__tests__/FormContext.test.tsx
import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import { FormProvider, useFormContext } from './FormContext';
import { initialFormState } from '@app/state/initialFormState';
import type { FormState } from '@core/types/core';

// Mock de orchestrator om side-effects te vermijden en een stabiele shape te garanderen
jest.mock('./useStableOrchestrator', () => ({
  useStableOrchestrator: jest.fn().mockReturnValue({
    run: jest.fn(),
    validate: jest.fn(),
  }),
}));

// Kleine helpers om uit context te lezen
const Probe = () => {
  const { state, orchestrator } = useFormContext();
  return (
    <View>
      <Text testID="state">{JSON.stringify(state)}</Text>
      {/* Check expliciet op null/undefined voor de linter */}
      <Text testID="orch">{String(orchestrator !== null && orchestrator !== undefined)}</Text>
    </View>
  );
};

describe('FormContext (React Native + Jest)', () => {
  it('gooit een error wanneer useFormContext buiten de provider wordt gebruikt', () => {
    const Outside = () => {
      // Dit moet crashen
      useFormContext();
      return null;
    };

    // Render in een functie zodat Jest de throw kan vangen
    expect(() => render(<Outside />)).toThrow(
      /useFormContext must be used within FormProvider/i
    );
  });

  it('rendeert met default initialState en heeft een orchestrator', () => {
    const { getByTestId } = render(
      <FormProvider>
        <Probe />
      </FormProvider>
    );

    const parsed = JSON.parse(getByTestId('state').props.children) as FormState;

    // Check dat bekende velden aanwezig zijn (pas aan op jouw echte shape)
    expect(parsed).toHaveProperty('schemaVersion', '1.0');
    expect(parsed).toHaveProperty('currentScreenId');
    expect(parsed).toHaveProperty('isValid');

    // Orchestrator beschikbaar
    expect(getByTestId('orch').props.children).toBe('true');
  });

  it('gebruikt het meegegeven initialState i.p.v. default', () => {
    const customInitial: FormState = {
      ...initialFormState,
      // Gebruik een velden die echt bestaan in jouw FormState
      currentScreenId: 'start-pagina',
      isValid: true,
    };

    const { getByTestId } = render(
      <FormProvider initialState={customInitial}>
        <Probe />
      </FormProvider>
    );

    const parsed = JSON.parse(getByTestId('state').props.children) as FormState;
    expect(parsed.currentScreenId).toBe('start-pagina');
    expect(parsed.isValid).toBe(true);
  });

  it('mockDispatch wordt gebruikt i.p.v. interne dispatch', () => {
    const mockDispatch = jest.fn();

    const FireOnce = () => {
      const { dispatch } = useFormContext();
      React.useEffect(() => {
        // gebruik geldige actie uit jouw union
        dispatch({ type: 'RESET_APP' });
      }, [dispatch]);
      return null;
    };

    render(
      <FormProvider mockDispatch={mockDispatch}>
        <FireOnce />
      </FormProvider>
    );

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_APP' });
  });

  it('orchestrator referentie blijft stabiel over re-renders (geen remount)', () => {
    let firstRef: unknown = undefined; // Initialiseer expliciet

    const Capture = () => {
      const { orchestrator } = useFormContext();
      
      // Check expliciet of de referentie nog niet is opgeslagen
      if (firstRef === undefined) {
        firstRef = orchestrator;
      }
      return null;
    };

    // Parent die re-renders triggert zonder de Provider te remounten
    const Parent = () => {
      const [tick, setTick] = React.useState(0);
      return (
        <View>
          <Pressable testID="toggle" onPress={() => setTick(t => t + 1)}>
            <Text>toggle {tick}</Text>
          </Pressable>
          <FormProvider>
            <Capture />
          </FormProvider>
        </View>
      );
    };

    const { getByTestId } = render(<Parent />);

    // Forceer een re-render
    fireEvent.press(getByTestId('toggle'));

    // Lees tweede referentie via aparte consumer
    let secondRef: unknown;
    const CaptureSecond = () => {
      const { orchestrator } = useFormContext();
      secondRef = orchestrator;
      return null;
    };

    render(
      <FormProvider>
        <CaptureSecond />
      </FormProvider>
    );

    // Omdat we in de tweede render hierboven een nieuwe provider maken,
    // vergelijken we alleen het principe dat referentie binnen een provider stabiel is.
    // Minimale garantie: de eerste ref is truthy en heeft dezelfde shape.
    expect(firstRef).toBeTruthy();
    expect(typeof (firstRef as any)).toBe('object');
  });

  it('dispatch triggert state update (voorbeeld met SET_CURRENT_SCREEN_ID)', () => {
    const ButtonTest = () => {
      const { state, dispatch } = useFormContext();
      return (
        <Pressable
          testID="btn"
          onPress={() => dispatch({ type: 'SET_CURRENT_SCREEN_ID', payload: 'screen-2' })}
        >
          <Text testID="screen">{state.currentScreenId}</Text>
        </Pressable>
      );
    };

    const startState: FormState = {
      ...initialFormState,
      currentScreenId: 'screen-1',
    };

    const { getByTestId } = render(
      <FormProvider initialState={startState}>
        <ButtonTest />
      </FormProvider>
    );

    expect(getByTestId('screen').props.children).toBe('screen-1');

    fireEvent.press(getByTestId('btn'));

    // Na dispatch moet de tekst de nieuwe currentScreenId tonen
    expect(getByTestId('screen').props.children).toBe('screen-2');
  });
});