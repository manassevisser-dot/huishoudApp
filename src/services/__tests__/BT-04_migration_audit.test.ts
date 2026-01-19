import { it, expect, describe, vi } from 'vitest';
import { migrateToPhoenix } from '../migrationService';
import { FormStateSchema } from '../../state/schemas/FormStateSchema';

// We mocken de zware test-utils om de SyntaxError te voorkomen
vi.mock('@test-utils/index', () => ({
  createMockState: () => ({
    activeStep: 'LANDING',
    currentPageId: '1setupHousehold',
    isValid: true,
    data: {
      setup: { aantalMensen: 0, aantalVolwassen: 0, autoCount: 'Nee' },
      household: { members: [] },
      finance: { income: { items: [] }, expenses: { items: [] } }
    },
    meta: { version: 1, lastModified: new Date().toISOString() }
  })
}));

describe('BT-04: Storage Migration Audit (Zod Enforcement)', () => {
  it('moet bewijzen dat gemigreerde data 100% voldoet aan het FormStateSchema', async () => {
    const legacyState = {
      metadata: { schemaVersion: '0', migratedAt: '2023-01-01T00:00:00Z' },
      aantalMensen: 2,
      leden: [{ naam: 'Jan Jansen', memberType: 'adult', age: 40 }]
    };

    const migratedData = await migrateToPhoenix(legacyState);
    const result = FormStateSchema.safeParse(migratedData);

    if (!result.success) {
      console.log('Audit Error:', result.error.format());
    }

    expect(result.success).toBe(true);
    expect(migratedData.data.setup.aantalMensen).toBe(2);
  });
});