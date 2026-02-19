// src/utils/objects.test.ts
import { deepMerge } from './objects';

describe('deepMerge', () => {
  it('moet een kopie van target retourneren als source undefined of null is', () => {
    const target = { a: 1, b: { c: 2 } };
    
    expect(deepMerge(target, undefined)).toEqual(target);
    expect(deepMerge(target, undefined)).not.toBe(target); // Moet een nieuwe referentie zijn
  });

  it('moet simpele properties overschrijven', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 } as any; // Cast naar any voor test-doeleinden
    
    const result = deepMerge(target, source);
    
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('moet geneste objecten recursief mergen', () => {
    const target = { 
      user: { 
        id: 1, 
        profile: { name: 'Jan' } 
      },
      status: 'active'
    };
    const source = { 
      user: { 
        profile: { name: 'Piet' } 
      } 
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      user: { 
        id: 1, 
        profile: { name: 'Piet' } 
      },
      status: 'active'
    });
  });

  it('moet arrays volledig overschrijven (niet mergen)', () => {
    const target = { items: [1, 2, 3], other: 'data' };
    const source = { items: [4, 5] };

    const result = deepMerge(target, source);

    expect(result.items).toEqual([4, 5]);
    expect(result.other).toBe('data');
  });

  it('moet primitives over objecten heen schrijven en vice versa', () => {
    const target = { a: { b: 1 } };
    const source = { a: 2 } as any;

    const result = deepMerge(target, source);
    expect(result.a).toBe(2);
  });

  it('mag het originele target object niet muteren', () => {
    const target = { a: { b: 1 } };
    const source = { a: { b: 2 } };
    
    deepMerge(target, source);
    
    expect(target.a.b).toBe(1); // Check op onbedoelde mutatie
  });

  it('moet correct omgaan met null waarden in de source', () => {
    const target = { a: { b: 1 } };
    const source = { a: null } as any;

    const result = deepMerge(target, source);
    expect(result.a).toBeNull();
  });
});