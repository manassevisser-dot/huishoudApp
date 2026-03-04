// src/domain/registry/BaseRegistry.test.ts

import { IBaseRegistry } from './BaseRegistry';

describe('IBaseRegistry contract', () => {
  // Maak een concrete implementatie voor testdoeleinden
  type TestKey = 'key1' | 'key2' | 'key3';
  type TestDefinition = { value: string };

  class TestRegistry implements IBaseRegistry<TestKey, TestDefinition> {
    private definitions: Map<TestKey, TestDefinition> = new Map([
      ['key1', { value: 'definition1' }],
      ['key2', { value: 'definition2' }],
    ]);

    getDefinition(key: TestKey): TestDefinition | null {
      return this.definitions.get(key) || null;
    }

    isValidKey(key: string): key is TestKey {
      return this.definitions.has(key as TestKey);
    }

    getAllKeys(): TestKey[] {
      return Array.from(this.definitions.keys());
    }
  }

  let registry: TestRegistry;

  beforeEach(() => {
    registry = new TestRegistry();
  });

  describe('getDefinition', () => {
    it('should return definition for existing key', () => {
      const result = registry.getDefinition('key1');
      expect(result).toEqual({ value: 'definition1' });
    });

    it('should return null for non-existing key', () => {
      const result = registry.getDefinition('key3' as TestKey);
      expect(result).toBeNull();
    });

    it('should handle undefined keys gracefully', () => {
      // @ts-expect-error - testen met ongeldige key
      const result = registry.getDefinition('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('isValidKey', () => {
    it('should return true for valid keys', () => {
      expect(registry.isValidKey('key1')).toBe(true);
      expect(registry.isValidKey('key2')).toBe(true);
    });

    it('should return false for invalid keys', () => {
      expect(registry.isValidKey('key3')).toBe(false);
      expect(registry.isValidKey('key4')).toBe(false);
      expect(registry.isValidKey('')).toBe(false);
      expect(registry.isValidKey('random')).toBe(false);
    });

    it('should act as a type guard', () => {
      const input: string = 'key1';
      if (registry.isValidKey(input)) {
        // TypeScript weet nu dat input van type TestKey is
        const definition = registry.getDefinition(input);
        expect(definition).toBeDefined();
      } else {
        // Fallback voor ongeldige keys
        expect(true).toBe(true);
      }
    });
  });

  describe('getAllKeys', () => {
    it('should return all registered keys', () => {
      const keys = registry.getAllKeys();
      expect(keys).toEqual(['key1', 'key2']);
      expect(keys).toHaveLength(2);
    });

    it('should return empty array when no keys registered', () => {
      class EmptyRegistry extends TestRegistry {
        private emptyMap: Map<TestKey, TestDefinition> = new Map();
        getAllKeys(): TestKey[] {
          return Array.from(this.emptyMap.keys());
        }
      }
      
      const emptyRegistry = new EmptyRegistry();
      expect(emptyRegistry.getAllKeys()).toEqual([]);
    });
  });

  describe('contract compliance', () => {
    it('should maintain consistent behavior across methods', () => {
      const allKeys = registry.getAllKeys();
      
      allKeys.forEach(key => {
        // isValidKey moet true zijn voor keys uit getAllKeys
        expect(registry.isValidKey(key)).toBe(true);
        
        // getDefinition moet definitie retourneren voor geldige keys
        const definition = registry.getDefinition(key);
        expect(definition).not.toBeNull();
      });
    });

    it('should handle edge cases consistently', () => {
      // Test met lege string
      expect(registry.isValidKey('')).toBe(false);
      
      // Test met undefined
      expect(registry.isValidKey(undefined as any)).toBe(false);
      
      // Test met null
      expect(registry.isValidKey(null as any)).toBe(false);
      
      // Test met nummers
      expect(registry.isValidKey(123 as any)).toBe(false);
    });
  });
});