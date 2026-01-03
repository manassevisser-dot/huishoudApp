import { renderHookWithProviders } from '@test-utils/index';
import { useAppOrchestration } from '../useAppOrchestration';
import { createMockState } from '@test-utils/index';

describe('useAppOrchestration (Phoenix/Legacy)', () => {
  
  it('Phoenix envelope v2 → READY', () => {
    // ✅ FIX 1: Matchen met PhoenixEnvelopeV2 interface (payload + timestamp)
    const mockEnvelope = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      payload: createMockState({
        schemaVersion: '1.0',
        isValid: true // Zorgt voor de READY status
      })
    };

    const { result } = renderHookWithProviders(
      () => useAppOrchestration(mockEnvelope)
    );

    // De hook leidt 'READY' af als de state valide is
    expect(result.current.status).toBe('READY');
  });

  it('HYDRATING → ONBOARDING bij undefined', () => {
    // ✅ FIX 2: Gebruik undefined in plaats van null (TS strict check)
    // We kunnen het argument ook weglaten omdat het optioneel is.
    const { result } = renderHookWithProviders(
      () => useAppOrchestration(undefined)
    );
    
    // Als er geen data is, valt de app terug op de initiële state/onboarding
    // Let op: controleer of je hook 'ONBOARDING' daadwerkelijk teruggeeft bij lege state
    expect(result.current.status).toBe('ONBOARDING');
  });
});