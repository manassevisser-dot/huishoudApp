
import { makePhoenixState } from '@test-utils/state';

// ⚠️ Belangrijk: geen top-level import van StorageShim gebruiken,
// omdat we per test met jest.doMock werken en daarna `require('../storageShim')`
// doen zodat de module opnieuw geëvalueerd wordt met de mock in scope.

describe('CU-001-SHIM StorageShim', () => {
  beforeEach(() => {
    // Cruciaal: reset module cache en mocks zodat doMock telkens opnieuw werkt
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('delegates loadState to legacy when available (Integriteits-gate)', async () => {
    // Mock legacy storage die een volledige Phoenix v1.0 state teruggeeft
    jest.doMock('@services/storage', () => ({
      __esModule: true,
      Storage: {
        loadState: jest.fn(async () => ({
          schemaVersion: '1.0',
          data: {
            setup: {},
            household: { members: [] },
            finance: {},
          },
        })),
      },
    }));

    const { StorageShim } = require('../storageShim');
    const res = await StorageShim.loadState();

    expect(res?.schemaVersion).toBe('1.0');
    expect(res?.data?.household?.members).toEqual([]);
  });

  it('returns null on loadState when legacy is absent (Anti-corruption gate)', async () => {
    jest.doMock('@services/storage', () => ({ __esModule: true }));

    const { StorageShim } = require('../storageShim');
    const res = await StorageShim.loadState();

    expect(res).toBeNull();
  });

  it('enforces schemaVersion and envelope on saveState (Audit gate)', async () => {
    const mockSetItem = jest.fn();

    // Geen legacy → shim moet zelf AsyncStorage envelope schrijven
    jest.doMock('@services/storage', () => ({ __esModule: true }));
    jest.doMock('@react-native-async-storage/async-storage', () => ({
      __esModule: true,
      default: { setItem: mockSetItem },
    }));

    const { StorageShim } = require('../storageShim');

 // ✅ Gebruik de helper voor Phoenix-proof state
 const mockState = makePhoenixState({
  activeStep: 'WIZARD',
  data: { 
    setup: {},                 // Setup staat op root niveau van data
    household: { members: [] }, // Household staat NAAST setup (niet erin)
    finance: {},               // Finance is verplicht volgens je type definitie
  },
});

    await StorageShim.saveState(mockState as any);

    const [key, rawValue] = mockSetItem.mock.calls[0];
    const payload = JSON.parse(rawValue);

    expect(key).toBe('@CashflowWizardState');
    expect(payload.version).toBe(2);
    expect(payload.state.schemaVersion).toBe('1.0');
    expect(payload.state.data.setup.aantalMensen).toBe(2);
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

    // Controleer dat alleen de Phoenix key gewist wordt
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
