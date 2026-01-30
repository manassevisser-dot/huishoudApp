import { FormStateOrchestrator } from '../FormStateOrchestrator';

describe('ORCH-VP-001: getValue(fieldId)', () => {
  
  const createMockState = (setupOverrides = {}) => ({
    schemaVersion: 1,
    data: {
      setup: {
        aantalMensen: 3,
        aantalVolwassen: 2,
        autoCount: 'Een' as const,
        heeftHuisdieren: true,
        ...setupOverrides,
      },
      members: [],
      household: {},
      finance: { income: [], expenses: [] },
    },
  });

  test('returns correct value for aantalMensen', () => {
    const mockState = createMockState();
    const orchestrator = new FormStateOrchestrator(mockState as any);
    
    const result = orchestrator.getValue('aantalMensen');
    expect(result).toBe(3);
  });

  test('returns correct value for autoCount', () => {
    const mockState = createMockState();
    const orchestrator = new FormStateOrchestrator(mockState as any);
    
    const result = orchestrator.getValue('autoCount');
    expect(result).toBe('Een');
  });

  test('returns undefined for unknown field', () => {
    const mockState = createMockState();
    const orchestrator = new FormStateOrchestrator(mockState as any);
    
    const result = orchestrator.getValue('unknownField' as any);
    expect(result).toBeUndefined();
  });
});