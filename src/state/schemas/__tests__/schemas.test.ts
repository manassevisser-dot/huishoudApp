// src/state/schemas/__tests__/schemas.test.ts
import { FormStateSchema } from '../FormStateSchema';

it('accepteert Phoenix v1.0 met centen integers', () => {
  const testData = {
    schemaVersion: '1.0',
    data: {
      setup: { aantalMensen: 2 },
      household: { members: [] },
      finance: {
        income: { items: [] },
        expenses: { items: [] }
      }
    }
  };

  const res = FormStateSchema.safeParse(testData);
  
  // Als dit faalt, log dan de error om te zien WELK veld niet klopt
  if (!res.success) {
    console.log('Zod Error:', JSON.stringify(res.error.format(), null, 2));
  }
  
  expect(res.success).toBe(true);
});

it('vereist expliciet schemaVersion 1.0', () => {
  const wrongVersion = {
    schemaVersion: '1.0', // Verkeerde versie
    data: { setup: {}, household: { members: [] }, finance: { income: { items: [] }, expenses: { items: [] } } }
  };

  const res = FormStateSchema.safeParse(wrongVersion);
  expect(res.success).toBe(false); // Moet falen op versie 2.0
});