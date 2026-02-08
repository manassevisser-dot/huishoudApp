import { migrateToPhoenix } from '../migrationService';
import { FormStateSchema } from '@adapters/validation/formStateSchema';

// We mocken de zware test-utils om de SyntaxError te voorkomen
jest.mock('@test-utils/index', () => ({
  createMockState: () => ({
    activeStep: 'LANDING',
    currentPageId: '1setupHousehold',
    isValid: true,
    data: {
      setup: { aantalMensen: 0, aantalVolwassen: 0, autoCount: 'Geen', heeftHuisdieren: false,
        woningType: 'Huur' },
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
      aantalMensen: 2, aantalVolwassen: 1,
      leden: [{ naam: 'Jan Jansen', memberType: 'adult', age: 40 }]
    };

    const migratedData = await migrateToPhoenix(legacyState);
    const result = FormStateSchema.safeParse(migratedData);

    if (!result.success) {
    }

    expect(result.success).toBe(true);
    expect(migratedData.data.setup.aantalMensen).toBe(2);
  });
});