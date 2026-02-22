import { FormStateOrchestrator } from './FormStateOrchestrator';

describe('ORCH-SW-001: updateField(fieldId, value)', () => {
  
  // Helper om basis state te maken
  const createMockState = (setupOverrides = {}) => ({
    schemaVersion: 1,
    data: {
      setup: {
        aantalMensen: 0,
        aantalVolwassen: 1,
        autoCount: 'Geen' as const,
        heeftHuisdieren: false,
        ...setupOverrides,
      },
      members: [],
      household: {},
      finance: { income: [], expenses: [] },
    },
  });
  
  test('updates aantalMensen correctly', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockState();
    const orchestrator = new FormStateOrchestrator(() => mockState as any, mockDispatch);
    
    orchestrator.updateField('aantalMensen', 5);
    
    const result = orchestrator.getValue('aantalMensen');
    expect(result).toBe(5);
  });

  test('updates autoCount correctly', () => {
    const mockDispatch = jest.fn();
    const mockState = createMockState();
    const orchestrator = new FormStateOrchestrator(() => mockState as any, mockDispatch);
    
    orchestrator.updateField('autoCount', 'Twee');
    
    const result = orchestrator.getValue('autoCount');
    expect(result).toBe('Twee');
  });

  test('updates heeftHuisdieren correctly', () => {
    const mockState = createMockState({ heeftHuisdieren: true });
    const mockDispatch = jest.fn();
    const orchestrator = new FormStateOrchestrator(() => mockState as any, mockDispatch);
    
    orchestrator.updateField('heeftHuisdieren', false);
    
    const result = orchestrator.getValue('heeftHuisdieren');
    expect(result).toBe(false);
  });
});
