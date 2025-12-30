// src/app/hooks/__tests__/useAppOrchestration.test.tsx
import { renderHookWithProviders } from '@test-utils/renderHook';
import { useAppOrchestration } from '../useAppOrchestration';
import { FormStateFixture } from '@test-utils/fixtures';

describe('useAppOrchestration (Phoenix/Legacy)', () => {
  // src/app/hooks/__tests__/useAppOrchestration.test.tsx

it('Phoenix envelope v2 → READY', () => {
  // De mockEnvelope moet exact matchen met de type-definitie van PhoenixEnvelopeV2
  const mockEnvelope = {
    version: 2 as const,
    state: {
      schemaVersion: '1.0' as const, // DIT miste je
      data: FormStateFixture.data,  // Gebruik de data-property van je fixture
    }
  };

  const { result } = renderHookWithProviders(
    () => useAppOrchestration(mockEnvelope)
  );

  expect(result.current.status).toBe('READY');
});

  it('HYDRATING → ONBOARDING bij null', () => {
    const { result } = renderHookWithProviders(
      () => useAppOrchestration(null)
    );
    
    expect(result.current.status).toBe('ONBOARDING');
  });
});