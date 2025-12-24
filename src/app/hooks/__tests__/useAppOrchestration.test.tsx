import * as React from 'react';
import { render, act } from '@testing-library/react-native';
import { useAppOrchestration } from '../useAppOrchestration';

// 1. Definieer mock-variabelen met het 'mock' prefix (voor hoisting-safety)
const mockDispatch = jest.fn();
const mockContextValue = {
  state: {},
  dispatch: mockDispatch,
};

// 2. Mocks - Houd het simpel: return direct wat de hook verwacht
jest.mock('@services/storageShim', () => ({
  __esModule: true,
  default: {
    loadState: jest.fn(async () => null),
    saveState: jest.fn(async () => undefined),
    clearAll: jest.fn(async () => undefined),
  },
}));

jest.mock('@state/schemas/FormStateSchema', () => ({
  __esModule: true,
  FormStateSchema: { safeParse: jest.fn((d) => ({ success: true, data: d })) },
}));

jest.mock('@selectors/householdSelectors', () => ({
  __esModule: true,
  selectIsSpecialStatus: jest.fn(() => false),
}));

// De cruciale fix: Eén enkele mock zonder React referentie
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

    // Check op de juiste naamgeving met underscores (Phoenix standaard)
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LOAD_SAVED_STATE' }),
    );

    // Bonus: Controleer of de shadow-flag (ADR-17/Household rule) ook is afgevuurd
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_SPECIAL_STATUS', payload: false }),
    );
  });

  it('ERROR for corrupt payload', async () => {
    const shim = require('@services/storageShim').default;
    shim.loadState.mockResolvedValueOnce({ corrupt: 'data' });

    const z = require('@state/schemas/FormStateSchema');
    z.FormStateSchema.safeParse.mockReturnValueOnce({ success: false });

    const { result } = await renderOrchestrator();
    expect(result.status).toBe('ERROR');
  });

  // Helper om de hook te renderen zonder Context Wrapper
  async function renderOrchestrator() {
    let currentStatus: any = 'INITIALIZING';
    const TestComponent = () => {
      const { status } = useAppOrchestration();
      currentStatus = status;
      return null;
    };

    render(<TestComponent />);

    // Wacht op de useEffect ticks
    await act(async () => {
      await Promise.resolve(); // INITIALIZING -> HYDRATING
      await Promise.resolve(); // HYDRATING -> FINAL STATE
    });

    return { result: { status: currentStatus } };
  }
});
