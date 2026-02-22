// src/app/hooks/__tests__/transactionActions.test.ts
import { executeUpdateAction } from './transactionActions';

// 🔧 Mock de afhankelijke modules
jest.mock('@adapters/validation/ResearchContractAdapter', () => ({
  ResearchValidator: {
    validateMoney: jest.fn(),
  },
}));

jest.mock('@adapters/transaction/stateful', () => {
  // We exporteren hier geen echte class; in de test gebruiken we een mock object
  return {};
});

import { ResearchValidator } from '@adapters/validation/ResearchContractAdapter';

type AdapterMock = {
  calculateDistribution: jest.Mock<any, [number, number]>;
  getCurrentState: jest.Mock<any, []>;
  push: jest.Mock<void, [any, string]>;
};

const makeAdapter = (opts?: {
  currentState?: Record<string, unknown> | null;
  distribution?: unknown;
}): AdapterMock => {
  const { currentState = { some: 'existing' }, distribution = { parts: [50, 50] } } = opts ?? {};
  return {
    calculateDistribution: jest.fn().mockReturnValue(distribution),
    getCurrentState: jest.fn().mockReturnValue(currentState),
    push: jest.fn(),
  };
};

describe('executeUpdateAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('valideert het bedrag en pusht de gemergde state met distributie en lastUpdated', () => {
    // Arrange
    const adapter = makeAdapter({
      currentState: { id: 'txn-1', meta: { actor: 'user' } },
      distribution: { parts: [30, 70] },
    });

    const fixedDate = new Date('2025-05-17T10:11:12.000Z');
    jest.useFakeTimers().setSystemTime(fixedDate);

    const inputValue = 1234;
    const parts = 2;

    // Act
    executeUpdateAction(adapter as any, inputValue, parts);

    // Assert validatie
    expect(ResearchValidator.validateMoney).toHaveBeenCalledTimes(1);
    expect(ResearchValidator.validateMoney).toHaveBeenCalledWith({
      amount: inputValue,
      currency: 'EUR',
    });

    // Assert berekening & state ophalen
    expect(adapter.calculateDistribution).toHaveBeenCalledTimes(1);
    expect(adapter.calculateDistribution).toHaveBeenCalledWith(inputValue, parts);

    expect(adapter.getCurrentState).toHaveBeenCalledTimes(1);

    // Assert push payload
    expect(adapter.push).toHaveBeenCalledTimes(1);
    const [payload, tag] = adapter.push.mock.calls[0];

    expect(tag).toBe('USER_UPDATE');
    // current state gemerged + distribution + lastUpdated
    expect(payload).toMatchObject({
      id: 'txn-1',
      meta: { actor: 'user' },
      distribution: { parts: [30, 70] },
      lastUpdated: fixedDate.toISOString(),
    });

    // lastUpdated moet echt een ISO string zijn
    expect(typeof payload.lastUpdated).toBe('string');
    expect(() => new Date(payload.lastUpdated)).not.toThrow();
  });

  it('werkt ook wanneer getCurrentState null/undefined geeft (merge met {})', () => {
    const adapter = makeAdapter({
      currentState: null, // of undefined
      distribution: { parts: [25, 25, 50] },
    });

    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

    executeUpdateAction(adapter as any, 200, 3);

    expect(adapter.getCurrentState).toHaveBeenCalled();
    expect(adapter.push).toHaveBeenCalledTimes(1);

    const [payload, tag] = adapter.push.mock.calls[0];
    expect(tag).toBe('USER_UPDATE');
    // Geen oude keys, maar wel distribution en lastUpdated
    expect(payload).toMatchObject({
      distribution: { parts: [25, 25, 50] },
      lastUpdated: '2024-01-01T00:00:00.000Z',
    });
  });

  it('roept calculateDistribution met juiste parameters (inputValue, parts)', () => {
    const adapter = makeAdapter();
    executeUpdateAction(adapter as any, 999, 7);
    expect(adapter.calculateDistribution).toHaveBeenCalledWith(999, 7);
  });

  it('propagates/throwt een fout wanneer validatie faalt en roept geen push aan', () => {
    // Arrange: laat de validator throwen
    (ResearchValidator.validateMoney as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid amount');
    });

    const adapter = makeAdapter();

    // Act & Assert
    expect(() => executeUpdateAction(adapter as any, -1, 2)).toThrow('Invalid amount');

    // Geen verdere calls na validatie-error
    expect(adapter.calculateDistribution).not.toHaveBeenCalled();
    expect(adapter.getCurrentState).not.toHaveBeenCalled();
    expect(adapter.push).not.toHaveBeenCalled();
  });
});