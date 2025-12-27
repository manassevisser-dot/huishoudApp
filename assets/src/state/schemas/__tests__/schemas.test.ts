import { FormStateSchema } from '../FormStateSchema';

describe('WAI-005A Zod Schemas (Clean Version)', () => {
  it('accepteert Phoenix v1.0 met centen integers', () => {
    const data = {
      schemaVersion: '1.0',
      C7: { items: [{ id: 'i1', amount: 125050 }] }, // 1250,50 euro in centen [cite: 23]
      C10: { items: [] }, // Lege array is toegestaan door .default([]) [cite: 18]
    };
    const res = FormStateSchema.safeParse(data);
    expect(res.success).toBe(true);
  });

  it('weigert legacy floats', () => {
    const legacy = {
      schemaVersion: '1.0',
      C7: { items: [{ id: 'i1', amount: 12.5 }] }, // Floats worden afgewezen [cite: 23, 27]
    };
    const res = FormStateSchema.safeParse(legacy);
    expect(res.success).toBe(false);
  });

  it('staat onbekende velden toe via passthrough', () => {
    const data = {
      schemaVersion: '1.0',
      oude_instelling: true, // Onbekende sleutel wordt geaccepteerd [cite: 20, 24]
    };
    const res = FormStateSchema.safeParse(data);
    expect(res.success).toBe(true);
  });
});
