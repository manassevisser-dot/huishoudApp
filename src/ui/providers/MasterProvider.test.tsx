import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { MasterProvider, useMaster } from './MasterProvider';
import { useFormState } from './FormStateProvider';
import { useStableOrchestrator } from '@app/context/useStableOrchestrator';

// Mock de dependencies
jest.mock('./FormStateProvider');
jest.mock('@app/context/useStableOrchestrator');

describe('MasterProvider', () => {
  const mockMaster = {
    getSummary: jest.fn(),
    updateData: jest.fn(),
  };

  const mockFormState = {
    state: { activeStep: '1' },
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Configureer de mocks
    (useFormState as jest.Mock).mockReturnValue(mockFormState);
    (useStableOrchestrator as jest.Mock).mockReturnValue(mockMaster);
  });

  it('levert de orchestrator instance via useMaster', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MasterProvider>{children}</MasterProvider>
    );

    const { result } = renderHook(() => useMaster(), { wrapper });

    // Controleer of de orchestrator correct uit de context komt
    expect(result.current).toBe(mockMaster);
    // Verifieer dat de orchestrator is aangemaakt met de juiste state/dispatch
    expect(useStableOrchestrator).toHaveBeenCalledWith(
      mockFormState.state,
      mockFormState.dispatch
    );
  });

  it('memoized de master instance om onnodige re-renders te voorkomen', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MasterProvider>{children}</MasterProvider>
    );

    const { result, rerender } = renderHook(() => useMaster(), { wrapper });
    const firstRenderValue = result.current;

    rerender({});

    // Dankzij useMemo moet de referentie gelijk blijven
    expect(result.current).toBe(firstRenderValue);
  });

  it('gooit een error als useMaster buiten de provider wordt gebruikt', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useMaster())).toThrow(
      'useMaster must be used within <MasterProvider>'
    );

    consoleSpy.mockRestore();
  });
});