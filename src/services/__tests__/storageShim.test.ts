// src/services/__tests__/storageShim.test.ts
import { makePhoenixState } from '@test-utils/index'; // barrel van je test-utils

describe('CU-001-SHIM StorageShim', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();;
  });

  it('enforces schemaVersion and envelope on saveState (Audit gate)', async () => {
    const mockSetItem = jest.fn();

    // Geen legacy → shim moet envelop via AsyncStorage schrijven
    jest.doMock('@adapters/storage/storage', () => ({ __esModule: true }));
    jest.doMock('@react-native-async-storage/async-storage', () => ({
      __esModule: true,
      default: { setItem: mockSetItem },
    }));

    // Belangrijk: importeren NA de dojest.Mock zodat mocks gelden
    const { StorageShim } = require('../storageShim');

    // Valide Phoenix state met de set-up die je assert
    const mockState = makePhoenixState({
      data: {
        setup: { aantalMensen: 2, aantalVolwassen: 1, autoCount: 'Nee' },
        household: { members: [] },
        finance: { income: { items: [] }, expenses: { items: [] } },
      },
      activeStep: 'WIZARD',
      currentPageId: '1setupHousehold',
      isValid: true,
    });

    await StorageShim.saveState(mockState);

    // Envelope verifiëren
    expect(mockSetItem).toHaveBeenCalledTimes(1);
    const [key, rawValue] = mockSetItem.mock.calls[0];
    expect(key).toBe('@CashflowWizardState');

    const payload = JSON.parse(rawValue);
    expect(payload.version).toBe(2); // envelop versie
    expect(payload.state.schemaVersion).toBe('1.0'); // Phoenix schema versie
    expect(payload.state.data.setup.aantalMensen).toBe(2); // geneste waarde
  });
});
