import { FormStateSchema } from '@state/schemas/FormStateSchema';

describe('FormStateSchema', () => {
  const validState = {
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentPageId: 'page_1',
    isValid: true,
    data: {
      setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Nee' },
      household: { members: [] },
      finance: { 
        income: { items: [] }, 
        expenses: { items: [] } 
      },
    },
    meta: { lastModified: new Date().toISOString(), version: 1 }
  };

  it('accepteert een correcte Phoenix v1.0 state', () => {
    const res = FormStateSchema.safeParse(validState);
    if (!res.success) {
      console.log('Zod Error:', JSON.stringify(res.error.format(), null, 2));
    }
    expect(res.success).toBe(true);
  });

  it('weigert versie 2.0 (omdat we v1.0 eisen)', () => {
    const invalidState = { ...validState, schemaVersion: '2.0' };
    const res = FormStateSchema.safeParse(invalidState);
    expect(res.success).toBe(false);
  });
});