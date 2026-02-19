import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { FormStateProvider, useFormState } from './FormStateProvider';
import { initialFormState } from '@app/state/initialFormState';

describe('FormStateProvider', () => {
  it('moet de initialFormState leveren als er geen initialState is meegegeven', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormStateProvider>{children}</FormStateProvider>
    );

    const { result } = renderHook(() => useFormState(), { wrapper });

    expect(result.current.state).toEqual(initialFormState);
  });

  it('moet een custom initialState accepteren', () => {
    // FIX: We gebruiken nu 'activeStep' in plaats van 'step'
    const customState = { ...initialFormState, activeStep: 'custom-step-id' };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormStateProvider initialState={customState}>{children}</FormStateProvider>
    );

    const { result } = renderHook(() => useFormState(), { wrapper });

    expect(result.current.state.activeStep).toBe('custom-step-id');
  });

  it('moet de mockDispatch gebruiken indien meegegeven', () => {
    const mockDispatch = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormStateProvider mockDispatch={mockDispatch}>{children}</FormStateProvider>
    );

    const { result } = renderHook(() => useFormState(), { wrapper });
    
    // We gebruiken een actie die je reducer begrijpt
    const action = { type: 'SET_VALID', payload: true } as any;
    
    act(() => {
      result.current.dispatch(action);
    });

    expect(mockDispatch).toHaveBeenCalledWith(action);
  });

  it('moet een fout gooien als useFormState buiten de provider wordt gebruikt', () => {
    // Onderdruk de rode console.error van React tijdens deze specifieke test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useFormState())).toThrow(
      'useFormState must be used within <FormStateProvider>'
    );

    consoleSpy.mockRestore();
  });
});