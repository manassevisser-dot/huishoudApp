// CU-001-SHIM — Storage API shim (Phoenix v1.0)
// Test Suite: Validatie van delegatie-integriteit en envelope-structuur

import { type FormStateV1 } from '@state/schemas/FormStateSchema';

describe('CU-001-SHIM StorageShim', () => {
  beforeEach(() => {
    // Cruciaal: Reset de module cache zodat doMock elke keer opnieuw evalueert
    jest.resetModules();
    jest.clearAllMocks();
  });

  // Helper om de AsyncStorage mock te extraheren
  const getAsyncMock = () => require('@react-native-async-storage/async-storage').default;

  it('delegates loadState to legacy when available (Integriteits-gate)', async () => {
    // Mock de legacy storage met een specifiek Phoenix v1.0 object
    jest.doMock('@services/storage', () => ({
      __esModule: true,
      Storage: {
        loadState: jest.fn(async () => ({ schemaVersion: '1.0', C1: { aantalMensen: 1 } })),
      },
    }));

    const { StorageShim } = require('../storageShim');
    const res = await StorageShim.loadState();

    expect(res?.schemaVersion).toBe('1.0');
    expect(res?.C1?.aantalMensen).toBe(1);
  });

  it('returns null on loadState when legacy is absent (Anti-corruption gate)', async () => {
    // Bewijs dat de shim NIET zelf gaat parsen als de legacy engine ontbreekt
    jest.doMock('@services/storage', () => ({ __esModule: true }));

    const { StorageShim } = require('../storageShim');
    const res = await StorageShim.loadState();

    expect(res).toBeNull();
  });

  it('enforces schemaVersion and envelope on saveState (Audit gate)', async () => {
    const mockSetItem = jest.fn();
    jest.doMock('@services/storage', () => ({ __esModule: true }));
    jest.doMock('@react-native-async-storage/async-storage', () => ({
      __esModule: true,
      default: { setItem: mockSetItem },
    }));

    const { StorageShim } = require('../storageShim');
    const mockState = { C1: { aantalMensen: 2 } };

    await StorageShim.saveState(mockState as any);

    // Verifieer de volledige Phoenix-envelope (V2 infrastructuur + V1.0 schema)
    const [key, rawValue] = mockSetItem.mock.calls[0];
    const payload = JSON.parse(rawValue);

    expect(key).toBe('@CashflowWizardState');
    expect(payload.version).toBe(2);
    expect(payload.state.schemaVersion).toBe('1.0');
    expect(payload.state.C1.aantalMensen).toBe(2);
  });

  it('uses removeItem instead of clear() for compliance (Safety gate)', async () => {
    const mockRemoveItem = jest.fn();
    jest.doMock('@services/storage', () => ({ __esModule: true }));
    jest.doMock('@react-native-async-storage/async-storage', () => ({
      __esModule: true,
      default: { removeItem: mockRemoveItem },
    }));

    const { StorageShim } = require('../storageShim');
    await StorageShim.clearAll();

    // Check of we specifiek de Phoenix-key wissen en niet het hele device
    expect(mockRemoveItem).toHaveBeenCalledWith('@CashflowWizardState');
  });

  it('delegates clearAll to legacy if available', async () => {
    const mockLegacyClear = jest.fn();
    jest.doMock('@services/storage', () => ({
      __esModule: true,
      Storage: { clearAll: mockLegacyClear },
    }));

    const { StorageShim } = require('../storageShim');
    await StorageShim.clearAll();

    expect(mockLegacyClear).toHaveBeenCalled();
  });
});
