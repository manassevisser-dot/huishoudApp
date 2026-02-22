import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { FormStateProvider, useFormState } from './FormStateProvider';
import { initialFormState } from '@app/state/initialFormState';

describe('FormStateProvider', () => {
  it('levert de initialFormState als er geen custom state wordt meegegeven', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormStateProvider>{children}</FormStateProvider>
    );

    const { result } = renderHook(() => useFormState(), { wrapper });

    expect(result.current.state).toEqual(initialFormState);
  });

  it('accepteert en serveert een custom initialState', () => {
    const customState = { 
      ...initialFormState, 
      activeStep: 'custom-step-id' 
    };
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormStateProvider initialState={customState}>{children}</FormStateProvider>
    );

    const { result } = renderHook(() => useFormState(), { wrapper });

    expect(result.current.state.activeStep).toBe('custom-step-id');
  });

  it('gebruikt de mockDispatch wanneer deze is meegegeven via props', () => {
    const mockDispatch = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormStateProvider mockDispatch={mockDispatch}>{children}</FormStateProvider>
    );

    const { result } = renderHook(() => useFormState(), { wrapper });
    const testAction = { type: 'SET_VALID', payload: true } as any;

    act(() => {
      result.current.dispatch(testAction);
    });

    expect(mockDispatch).toHaveBeenCalledWith(testAction);
  });

  it('gooit een foutmelding als useFormState buiten de provider wordt aangeroepen', () => {
    // Voorkom dat de console.error de test-output vervuilt
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useFormState())).toThrow(
      'useFormState must be used within <FormStateProvider>'
    );

    consoleSpy.mockRestore();
  });
});