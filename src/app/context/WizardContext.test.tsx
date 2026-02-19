import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

// SUT
import { WizardProvider, useWizard } from './WizardContext';

// 🔧 Mocks voor de afhankelijke hooks
// Pas de paden exact aan jouw projectstructuur aan.
jest.mock('@ui/providers/FormStateProvider', () => ({
  useFormState: jest.fn(),
}));

jest.mock('@ui/providers/MasterProvider', () => ({
  useMaster: jest.fn(),
}));

import { useFormState } from '@ui/providers/FormStateProvider';
import { useMaster } from '@ui/providers/MasterProvider';

type MasterMock = {
  canNavigateNext: jest.Mock<boolean, [string]>;
  onNavigateNext: jest.Mock<void, []>;
  onNavigateBack: jest.Mock<void, []>;
};

const mkMaster = (canNextFor: Record<string, boolean> = {}): MasterMock => ({
  canNavigateNext: jest.fn((stepId: string) => !!canNextFor[stepId]),
  onNavigateNext: jest.fn(),
  onNavigateBack: jest.fn(),
});

const mkFormState = (activeStep: string, data: Record<string, unknown> = {}) => ({
  state: {
    activeStep,
    data,
  },
});

// Kleine probe section om eenvoudig uit de context te lezen en acties te vuren
const Probe: React.FC = () => {
  const { activeStepId, canNext, goToNextStep, goToPreviousStep } = useWizard();
  return (
    <View>
      <Text testID="step">{activeStepId}</Text>
      <Text testID="canNext">{String(canNext)}</Text>
      <Pressable testID="next" onPress={goToNextStep}>
        <Text>next</Text>
      </Pressable>
      <Pressable testID="prev" onPress={goToPreviousStep}>
        <Text>prev</Text>
      </Pressable>
    </View>
  );
};

describe('WizardProvider / useWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gooit een error wanneer useWizard buiten de provider wordt gebruikt', () => {
    const Outside: React.FC = () => {
      useWizard(); // zou moeten throwen
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      /useWizard must be used within a WizardProvider/i
    );
  });

  it('exposed activeStepId en canNext correct (canNavigateNext = true)', () => {
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-1', { foo: 1 }));
    const master = mkMaster({ 'step-1': true });
    (useMaster as jest.Mock).mockReturnValue(master);

    const { getByTestId } = render(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    expect(getByTestId('step').props.children).toBe('step-1');
    expect(getByTestId('canNext').props.children).toBe('true');
  });

  it('exposed canNext = false wanneer canNavigateNext false teruggeeft', () => {
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-2', {}));
    const master = mkMaster({ 'step-2': false });
    (useMaster as jest.Mock).mockReturnValue(master);

    const { getByTestId } = render(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    expect(getByTestId('step').props.children).toBe('step-2');
    expect(getByTestId('canNext').props.children).toBe('false');
  });

  it('goToNextStep roept master.onNavigateNext ALLEEN aan als canNext true is', () => {
    // Eerst canNext = true
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-1', {}));
    const master = mkMaster({ 'step-1': true, 'step-2': false });
    (useMaster as jest.Mock).mockReturnValue(master);

    const { getByTestId, rerender } = render(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    fireEvent.press(getByTestId('next'));
    expect(master.onNavigateNext).toHaveBeenCalledTimes(1);

    // Scenario 2: canNext = false → niet aanroepen
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-2', {}));
    rerender(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    fireEvent.press(getByTestId('next'));
    expect(master.onNavigateNext).toHaveBeenCalledTimes(1); // nog steeds 1
  });

  it('goToPreviousStep roept altijd master.onNavigateBack aan', () => {
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-1', {}));
    const master = mkMaster({ 'step-1': true });
    (useMaster as jest.Mock).mockReturnValue(master);

    const { getByTestId } = render(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    fireEvent.press(getByTestId('prev'));
    expect(master.onNavigateBack).toHaveBeenCalledTimes(1);
  });

  it('canNext recompute bij wijzigingen in activeStepId of state.data', () => {
    // Start: step-1 => true
    const master = mkMaster({ 'step-1': true, 'step-2': false });
    (useMaster as jest.Mock).mockReturnValue(master);

    // Begin met data foo:1
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-1', { foo: 1 }));

    const { getByTestId, rerender } = render(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    expect(getByTestId('canNext').props.children).toBe('true');

    // Verander alleen data (dependency op state.data in useMemo)
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-1', { foo: 2 }));
    rerender(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    // Nog steeds step-1 => true
    expect(getByTestId('canNext').props.children).toBe('true');

    // Verander activeStep → step-2 => false
    (useFormState as jest.Mock).mockReturnValue(mkFormState('step-2', { foo: 2 }));
    rerender(
      <WizardProvider>
        <Probe />
      </WizardProvider>
    );

    expect(getByTestId('canNext').props.children).toBe('false');
  });
});