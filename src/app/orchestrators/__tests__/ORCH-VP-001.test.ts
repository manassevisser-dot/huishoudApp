import { describe, it, expect } from 'vitest';
import { FormStateOrchestrator } from '../FormStateOrchestrator';

// Mock form state volgens de FormState type definitie
const mockState = {
  data: {
    setup: {
      aantalMensen: 3,
      aantalVolwassen: 2,
      autoCount: 'Een',
      heeftHuisdieren: true
    }
  }
} as any; // Type cast naar any voor deze specifieke test setup

describe('ORCH-VP-001: getValue(fieldId)', () => {
  it('returns correct value for aantalMensen', () => {
    const orchestrator = new FormStateOrchestrator(mockState);
    const result = orchestrator.getValue('aantalMensen');
    expect(result).toBe(3);
  });

  it('returns correct value for autoCount', () => {
    const orchestrator = new FormStateOrchestrator(mockState);
    const result = orchestrator.getValue('autoCount');
    expect(result).toBe('Een');
  });

  it('returns undefined for unknown field', () => {
    const orchestrator = new FormStateOrchestrator(mockState);
    const result = orchestrator.getValue('unknownField');
    expect(result).toBeUndefined();
  });
});