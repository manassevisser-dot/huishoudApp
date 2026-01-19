import { it, expect, describe } from 'vitest';
import { z } from 'zod';
import { evaluateVisibilityCondition } from '../visibilityRules';

describe('FT-TARA-01: Real Logic Type Enforcement', () => {
  it('moet een string "25" via Zod naar number converteren en succesvol evalueren', () => {
    // 1. Definieer het schema (De poortwachter)
    const schema = z.object({
      age: z.coerce.number()
    });

    // 2. Ruwe input die vroeger voor problemen zorgde
    const rawInput = { age: '25' };
    const parsed = schema.safeParse(rawInput);

    expect(parsed.success).toBe(true);

    if (parsed.success) {
      // 3. De echte conditie zoals die in de app voorkomt
      const condition = { field: 'age', operator: 'gt', value: 18 };
      
      // 4. De echte evaluator aanroepen
      const result = evaluateVisibilityCondition(condition, {
        getValue: (fieldName: string) => parsed.data[fieldName as keyof typeof parsed.data]
      });

      expect(result).toBe(true);
      expect(typeof parsed.data.age).toBe('number');
    }
  });

  it('moet de evaluator beschermen tegen ongeldige data types', () => {
    const schema = z.object({ age: z.number() });
    const parsed = schema.safeParse({ age: 'geen-getal' });

    // Als de validatie faalt, wordt de evaluator niet eens aangeroepen in de app flow
    expect(parsed.success).toBe(false);
  });
});