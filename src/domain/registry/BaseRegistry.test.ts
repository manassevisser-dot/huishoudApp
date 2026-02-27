// src/domain/registry/BaseRegistry.test.ts
import { IBaseRegistry } from './BaseRegistry';

// Maak een mock registry voor testdoeleinden
interface TestDefinition {
  id: string;
  value: number;
}

const createMockRegistry = (): IBaseRegistry<string, TestDefinition> => {
  const mockData: Record<string, TestDefinition> = {
    'test1': { id: 'test1', value: 100 },
    'test2': { id: 'test2', value: 200 },
  };

  return {
    getDefinition: (key: string) => {
      const def = mockData[key];
      return def ? { ...def } : null;  // ← Clone het object!
    },
    isValidKey: (key: string): key is string => key in mockData,
    getAllKeys: () => Object.keys(mockData),
  };
};

describe('IBaseRegistry contract', () => {
  let registry: IBaseRegistry<string, TestDefinition>;

  beforeEach(() => {
    registry = createMockRegistry();
  });

  describe('getDefinition', () => {
    it('should return definition for existing key', () => {
      const def = registry.getDefinition('test1');
      expect(def).toBeDefined();
      expect(def?.id).toBe('test1');
      expect(def?.value).toBe(100);
    });

    it('should return null for non-existing key', () => {
      const def = registry.getDefinition('nonExisting');
      expect(def).toBeNull();
    });

    it('should handle undefined input gracefully', () => {
      // @ts-expect-error - testen van runtime gedrag
      const def = registry.getDefinition(undefined);
      expect(def).toBeNull();
    });

    it('should be pure - same input always returns same output', () => {
      const def1 = registry.getDefinition('test2');
      const def2 = registry.getDefinition('test2');
      expect(def1).toEqual(def2);
      expect(def1).toEqual({ id: 'test2', value: 200 });
    });
  });

  describe('isValidKey', () => {
    it('should return true for existing keys', () => {
      expect(registry.isValidKey('test1')).toBe(true);
      expect(registry.isValidKey('test2')).toBe(true);
    });

    it('should return false for non-existing keys', () => {
      expect(registry.isValidKey('test3')).toBe(false);
      expect(registry.isValidKey('')).toBe(false);
      expect(registry.isValidKey('invalid')).toBe(false);
    });

    it('should return false for undefined or null', () => {
      // @ts-expect-error - testen van runtime gedrag
      expect(registry.isValidKey(undefined)).toBe(false);
      // @ts-expect-error - testen van runtime gedrag
      expect(registry.isValidKey(null)).toBe(false);
    });

    it('should be a type guard', () => {
      const testKey: string = 'test1';
      
      if (registry.isValidKey(testKey)) {
        // Binnen deze block weet TypeScript dat testKey een geldige key is
        const def = registry.getDefinition(testKey);
        expect(def).toBeDefined();
        expect(def?.id).toBe('test1');
      }
    });

    it('should work with array filtering', () => {
      const keys = ['test1', 'invalid', 'test2', 'unknown'];
      const validKeys = keys.filter(registry.isValidKey);
      
      expect(validKeys).toEqual(['test1', 'test2']);
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys in the registry', () => {
      const keys = registry.getAllKeys();
      expect(keys).toBeInstanceOf(Array);
      expect(keys).toHaveLength(2);
      expect(keys).toContain('test1');
      expect(keys).toContain('test2');
    });

    it('should return empty array for empty registry', () => {
      const emptyRegistry: IBaseRegistry<string, TestDefinition> = {
        getDefinition: () => null,
       isValidKey: (key: string): key is string => false,
        getAllKeys: () => [],
      };

      expect(emptyRegistry.getAllKeys()).toEqual([]);
    });

    it('should return keys in consistent order', () => {
      const keys1 = registry.getAllKeys();
      const keys2 = registry.getAllKeys();
      expect(keys1).toEqual(keys2);
    });
  });

  describe('contract compliance', () => {
    it('should maintain invariant: key exists iff isValidKey true', () => {
      const keys = registry.getAllKeys();
      
      keys.forEach(key => {
        expect(registry.isValidKey(key)).toBe(true);
      });

      expect(registry.isValidKey('nonExistent')).toBe(false);
    });

    it('should maintain invariant: getDefinition returns non-null for all getAllKeys', () => {
      const keys = registry.getAllKeys();
      
      keys.forEach(key => {
        const def = registry.getDefinition(key);
        expect(def).not.toBeNull();
      });
    });

    it('should maintain invariant: getAllKeys returns all keys that are valid', () => {
      const allKeys = registry.getAllKeys();
      
      // Alle teruggegeven keys moeten geldig zijn
      allKeys.forEach(key => {
        expect(registry.isValidKey(key)).toBe(true);
      });

      // Alle mogelijk geldige keys (die we kunnen vinden) moeten in getAllKeys zitten
      const possibleKeys = ['test1', 'test2', 'test3'];
      const validKeysFromFilter = possibleKeys.filter(registry.isValidKey);
      
      expect(allKeys.sort()).toEqual(validKeysFromFilter.sort());
    });
  });

  describe('edge cases', () => {
    it('should handle registry with different key types', () => {
      // Test met union type keys
      type CustomKey = 'key1' | 'key2' | 'key3';
      
      const customRegistry: IBaseRegistry<CustomKey, number> = {
        getDefinition: (key: CustomKey) => {
          const values: Record<CustomKey, number> = {
            key1: 10,
            key2: 20,
            key3: 30,
          };
          return values[key] ?? null;
        },
        isValidKey: (key: string): key is CustomKey => {
          return ['key1', 'key2', 'key3'].includes(key);
        },
        getAllKeys: () => ['key1', 'key2', 'key3'] as CustomKey[],
      };

      expect(customRegistry.getDefinition('key1')).toBe(10);
      expect(customRegistry.isValidKey('key2')).toBe(true);
      expect(customRegistry.getAllKeys()).toHaveLength(3);
    });

    it('should handle registry with complex definitions', () => {
      interface ComplexDef {
        id: string;
        nested: {
          a: number;
          b: string;
        };
        optional?: boolean;
      }

      const complexRegistry: IBaseRegistry<string, ComplexDef> = {
        getDefinition: (key: string) => {
          if (key === 'complex') {
            return {
              id: 'complex',
              nested: { a: 42, b: 'test' },
              optional: true,
            };
          }
          return null;
        },
        isValidKey: (key: string): key is string => key === 'complex',
        getAllKeys: () => ['complex'],
      };

      const def = complexRegistry.getDefinition('complex');
      expect(def).toBeDefined();
      expect(def?.nested.a).toBe(42);
      expect(def?.optional).toBe(true);
    });

    it('should be readonly - modifying returned definitions should not affect registry', () => {
      const def = registry.getDefinition('test1');
      if (def) {
        def.value = 999; // Modify the returned object
      }

      // Original registry should be unchanged
      const newDef = registry.getDefinition('test1');
      expect(newDef?.value).toBe(100); // Still original value
    });
  });

  describe('functional patterns', () => {
    it('should work with map operations', () => {
      const keys = registry.getAllKeys();
      const definitions = keys
        .map(key => registry.getDefinition(key))
        .filter((def): def is TestDefinition => def !== null);

      expect(definitions).toHaveLength(2);
      expect(definitions.map(d => d.value)).toEqual([100, 200]);
    });

    it('should work with lookup operations', () => {
      const lookupKey = 'test2';
      
      if (registry.isValidKey(lookupKey)) {
        const def = registry.getDefinition(lookupKey);
        expect(def?.value).toBe(200);
      }
    });

    it('should work with dynamic key validation', () => {
      const userInput = ['test1', 'invalid', 'test2'];
      const validInputs = userInput.filter(registry.isValidKey);
      
      expect(validInputs).toEqual(['test1', 'test2']);
    });
  });
});