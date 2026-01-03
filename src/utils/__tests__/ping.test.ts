
// src/utils/__tests__/ping.test.ts
import { ping } from '@utils/ping';

describe('Phoenix Alias Sanity Check (met minimale state)', () => {
  it('moet de ping functie werken met minimale Phoenix-state', () => {
    const mockState = { data: { setup: {} } }; // minimale Phoenix-envelope
    expect(ping(mockState)).toBe('pong');      // pas aan als jouw ping(signature) anders is
  });
});
