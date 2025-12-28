//useAppOrchastration.test.tsx
import * as React from 'react';
import { render, act } from '@testing-library/react-native';
import { useAppOrchestration } from '../useAppOrchestration';

// 1. Phoenix Mocks (Hoisted)
const mockDispatch = jest.fn();
const mockContextValue = {
  state: {},
  dispatch: mockDispatch,
};

// ADR-01: Gebruik de juiste aliassen voor mocks
jest.mock('@services/storageShim', () => ({
  __esModule: true,
  default: {
    loadState: jest.fn(async () => null),
    saveState: jest.fn(async () => undefined),
    clearAll: jest.fn(async () => undefined),
  },
}));

jest.mock('@state/schemas/FormStateSchema', () => {
  return {
    __esModule: true,
    // Zorg dat we een object returnen met een werkende safeParse functie
    FormStateSchema: {
      safeParse: jest.fn().mockReturnValue({ success: true, data: {} })
    }
  };
});

jest.mock('@selectors/householdSelectors', () => ({
  __esModule: true,
  selectIsSpecialStatus: jest.fn(() => false),
}));

// FIX: Verwijder de "Path Collapse". Gebruik de schone alias.
jest.mock('@context/FormContext', () => ({
  __esModule: true,
  useFormContext: () => mockContextValue,
}));

describe('useAppOrchestration FSM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('UNBOARDING for new user (loadState=null)', async () => {
    const { result } = await renderOrchestrator();
    expect(result.status).toBe('UNBOARDING');
  });

  it('READY for valid v1.0', async () => {
    const shim = require('@services/storageShim').default;
    shim.loadState.mockResolvedValueOnce({ schemaVersion: '1.0' });

    const { result } = await renderOrchestrator();

    expect(result.status).toBe('READY');
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LOAD_SAVED_STATE' }),
    );
  });

  it('ERROR for corrupt payload', async () => {
    // 1. Bespioneer console.error en vertel hem niets te doen
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const shim = require('@services/storageShim').default;
    shim.loadState.mockResolvedValueOnce({ corrupt: 'data' });
  
    const z = require('@state/schemas/FormStateSchema');
    z.FormStateSchema.safeParse.mockReturnValueOnce({ 
      success: false, 
      error: { issues: [{ message: 'Invalid schema' }] } 
    });
  
    const { result } = await renderOrchestrator();
    
    expect(result.status).toBe('ERROR');
  
    // 2. Verifieer dat de error gelogd ZOU zijn (optioneel)
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Orchestrator] Validation failed'),
      expect.anything()
    );
  
    // 3. Herstel de console voor andere tests
    consoleSpy.mockRestore();
  });

  async function renderOrchestrator() {
    let currentStatus: any = 'INITIALIZING';
    const TestComponent = () => {
      const { status } = useAppOrchestration();
      currentStatus = status;
      return null;
    };

    render(<TestComponent />);

    // ADR-16: Robuuste async wait voor FSM transities
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)); 
    });

    return { result: { status: currentStatus } };
  }
});