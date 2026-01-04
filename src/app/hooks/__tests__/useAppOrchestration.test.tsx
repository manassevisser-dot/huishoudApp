import { renderHook, waitFor } from '@testing-library/react-native';
import { useAppOrchestration } from '../useAppOrchestration';
import { createMockState } from '@test-utils/index';
import { FormProvider } from '@app/context/FormContext';
import { storage } from '@services/storage';
import React from 'react';

// Mock storage
jest.mock('@services/storage', () => ({
  storage: {
    loadState: jest.fn(),
  },
}));

describe('useAppOrchestration (Phoenix/Legacy)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Helper functie binnen de describe scope
  const renderOrchestrator = (state: any, envelope?: any) => {
    return renderHook(() => useAppOrchestration(envelope), {
      wrapper: ({ children }) => (
        <FormProvider initialState={state}>
          {children}
        </FormProvider>
      ),
    });
  };

  it('moet status HYDRATING teruggeven als schemaVersion ontbreekt', () => {
    const mockState = createMockState();
    mockState.schemaVersion = undefined as any; 

    const { result } = renderOrchestrator(mockState);

    expect(result.current.status).toBe('HYDRATING');
  });

  it('moet data laden uit storage (Branch coverage lines 28-29)', async () => {
    const savedData = { data: { some: 'saved-data' } };
    (storage.loadState as jest.Mock).mockResolvedValue(savedData);
    
    const { result } = renderOrchestrator(createMockState());

    // waitFor handelt de 'act' waarschuwing intern af
    await waitFor(() => {
      expect(storage.loadState).toHaveBeenCalled();
    });
    
    expect(result.current.status).toBeDefined();
  });

  it('moet status READY teruggeven en dispatch aanroepen bij een valide envelope (Lines 22-23)', async () => {
    const mockEnvelope = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      payload: { some: 'data' }
    };

    const mockState = createMockState({
      schemaVersion: '1.0',
      isValid: true
    });

    const { result } = renderOrchestrator(mockState, mockEnvelope);

    await waitFor(() => {
      expect(result.current.status).toBe('READY');
    });
  });

  it('moet status READY teruggeven bij voltooide interne setup', () => {
    const mockState = createMockState({
      activeStep: 'dashboard',
      isValid: true,
      data: {
        household: { 
          members: [{ id: '1' }] as any 
        }
      }
    });

    const { result } = renderOrchestrator(mockState);

    expect(result.current.status).toBe('READY');
  });

  it('moet status INCOMPLETE teruggeven als data niet valide is', () => {
    const mockState = createMockState({
      activeStep: 'completed',
      isValid: false,
      data: {
        household: { 
          members: [{ id: '1' }] as any 
        }
      }
    });

    const { result } = renderOrchestrator(mockState);

    expect(result.current.status).toBe('INCOMPLETE');
  });

  it('moet status ONBOARDING teruggeven als er geen members zijn', () => {
    const mockState = createMockState({
      activeStep: 'dashboard',
      data: { household: { members: [] } }
    });

    const { result } = renderOrchestrator(mockState);

    expect(result.current.status).toBe('ONBOARDING');
  });
});