import { describe, it, expect } from 'vitest';
import { FormStateOrchestrator } from '../FormStateOrchestrator';

// Mock form state
const mockState = {
  data: {
    setup: {
      aantalMensen: 3,
      aantalVolwassen: 2,
      autoCount: 'Een',
      heeftHuisdieren: true
    }
  }
} as any;

describe('ORCH-SW-001: updateField(fieldId, value)', () => {
  it('updates aantalMensen correctly', () => {
    const orchestrator = new FormStateOrchestrator(mockState);
    orchestrator.updateField('aantalMensen', 5);
    
    // We verifiëren via getValue om de interface-consistentie te testen
    const result = orchestrator.getValue('aantalMensen');
    expect(result).toBe(5);
  });

  it('updates autoCount correctly', () => {
    const orchestrator = new FormStateOrchestrator(mockState);
    orchestrator.updateField('autoCount', 'Twee');
    
    const result = orchestrator.getValue('autoCount');
    expect(result).toBe('Twee');
  });

  it('updates heeftHuisdieren correctly', () => {
    const orchestrator = new FormStateOrchestrator(mockState);
    orchestrator.updateField('heeftHuisdieren', false);
    
    const result = orchestrator.getValue('heeftHuisdieren');
    expect(result).toBe(false);
  });
});