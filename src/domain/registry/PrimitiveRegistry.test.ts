// src/domain/registry/PrimitiveRegistry.test.ts
/**
 * @file_intent Unit tests voor PrimitiveRegistry - fundamentele UI-bouwstenen
 * @test_strategy
 *   - Test PRIMITIVE_TYPES constanten
 *   - Test PRIMITIVE_METADATA voor elk type
 *   - Test registry methods (getDefinition, isValidKey, getAllKeys)
 *   - Test helper functions (isValidPrimitiveType, validatePrimitiveRequirements)
 */

import { 
  PrimitiveRegistry, 
  PRIMITIVE_TYPES, 
  isValidPrimitiveType, 
  validatePrimitiveRequirements,
  type PrimitiveType,
  type PrimitiveMetadata
} from './PrimitiveRegistry';

describe('PrimitiveRegistry', () => {
  // =========================================================================
  // PRIMITIVE_TYPES CONSTANTS
  // =========================================================================

  describe('PRIMITIVE_TYPES', () => {
    it('should define all primitive types', () => {
      expect(PRIMITIVE_TYPES).toEqual({
        COUNTER: 'counter',
        CURRENCY: 'currency',
        TEXT: 'text',
        NUMBER: 'number',
        CHIP_GROUP: 'chip-group',
        CHIP_GROUP_MULTIPLE: 'chip-group-multiple',
        TOGGLE: 'toggle',
        RADIO: 'radio',
        LABEL: 'label',
        DATE: 'date',
        ACTION: 'action',
      });
    });

    it('should have unique values', () => {
      const values = Object.values(PRIMITIVE_TYPES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  // =========================================================================
  // PRIMITIVE_METADATA (via registry)
  // =========================================================================

  describe('metadata definitions', () => {
    const expectedTypes: PrimitiveType[] = [
      'counter',
      'currency',
      'text',
      'number',
      'chip-group',
      'chip-group-multiple',
      'radio',
      'label',
      'date',
      'toggle'
    ];

    test.each(expectedTypes)('should have metadata for %s', (type) => {
      const metadata = PrimitiveRegistry.getDefinition(type);
      expect(metadata).toBeDefined();
      expect(metadata?.type).toBe(type);
    });

    describe('counter metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('counter');
        expect(meta).toEqual({
          type: 'counter',
          requiresOptions: false,
          supportsPlaceholder: false,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });

    describe('currency metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('currency');
        expect(meta).toEqual({
          type: 'currency',
          requiresOptions: false,
          supportsPlaceholder: true,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });

    describe('text metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('text');
        expect(meta).toEqual({
          type: 'text',
          requiresOptions: false,
          supportsPlaceholder: true,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });

    describe('number metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('number');
        expect(meta).toEqual({
          type: 'number',
          requiresOptions: false,
          supportsPlaceholder: true,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });

    describe('chip-group metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('chip-group');
        expect(meta).toEqual({
          type: 'chip-group',
          requiresOptions: true,
          supportsPlaceholder: false,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });

    describe('chip-group-multiple metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('chip-group-multiple');
        expect(meta).toEqual({
          type: 'chip-group-multiple',
          requiresOptions: true,
          supportsPlaceholder: false,
          isReadOnly: false,
          supportsMultiSelect: true,
        });
      });
    });

    describe('radio metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('radio');
        expect(meta).toEqual({
          type: 'radio',
          requiresOptions: true,
          supportsPlaceholder: false,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });

    describe('label metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('label');
        expect(meta).toEqual({
          type: 'label',
          requiresOptions: false,
          supportsPlaceholder: false,
          isReadOnly: true,
          supportsMultiSelect: false,
        });
      });
    });

    describe('date metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('date');
        expect(meta).toEqual({
          type: 'date',
          requiresOptions: false,
          supportsPlaceholder: false,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });

    describe('toggle metadata', () => {
      it('should have correct metadata', () => {
        const meta = PrimitiveRegistry.getDefinition('toggle');
        expect(meta).toEqual({
          type: 'toggle',
          requiresOptions: true,
          supportsPlaceholder: false,
          isReadOnly: false,
          supportsMultiSelect: false,
        });
      });
    });
  });

  // =========================================================================
  // REGISTRY METHODS
  // =========================================================================

  describe('getDefinition', () => {
    it('should return metadata for valid primitive type', () => {
      const meta = PrimitiveRegistry.getDefinition('counter');
      expect(meta).toBeDefined();
      expect(meta?.type).toBe('counter');
    });

    it('should return null for invalid primitive type', () => {
      const meta = PrimitiveRegistry.getDefinition('invalid-type' as any);
      expect(meta).toBeNull();
    });

    it('should return null for empty string', () => {
      const meta = PrimitiveRegistry.getDefinition('' as any);
      expect(meta).toBeNull();
    });

    it('should handle case sensitivity', () => {
      // Should be case sensitive
      const meta = PrimitiveRegistry.getDefinition('COUNTER' as any);
      expect(meta).toBeNull();
    });
  });

  describe('isValidKey', () => {
    it('should return true for valid primitive types', () => {
      expect(PrimitiveRegistry.isValidKey('counter')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('currency')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('text')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('number')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('chip-group')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('chip-group-multiple')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('radio')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('label')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('date')).toBe(true);
      expect(PrimitiveRegistry.isValidKey('toggle')).toBe(true);
    });

    it('should return false for invalid primitive types', () => {
      expect(PrimitiveRegistry.isValidKey('invalid')).toBe(false);
      expect(PrimitiveRegistry.isValidKey('checkbox')).toBe(false);
      expect(PrimitiveRegistry.isValidKey('slider')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(PrimitiveRegistry.isValidKey('')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(PrimitiveRegistry.isValidKey('COUNTER')).toBe(false);
      expect(PrimitiveRegistry.isValidKey('Counter')).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    it('should return all primitive types', () => {
      const keys = PrimitiveRegistry.getAllKeys();
      
      expect(keys).toHaveLength(11);
      expect(keys).toContain('counter');
      expect(keys).toContain('currency');
      expect(keys).toContain('text');
      expect(keys).toContain('number');
      expect(keys).toContain('chip-group');
      expect(keys).toContain('chip-group-multiple');
      expect(keys).toContain('radio');
      expect(keys).toContain('label');
      expect(keys).toContain('date');
      expect(keys).toContain('toggle');
      expect(keys).toContain('action');
    });

    it('should return a new array each time', () => {
      const keys1 = PrimitiveRegistry.getAllKeys();
      const keys2 = PrimitiveRegistry.getAllKeys();
      
      expect(keys1).not.toBe(keys2); // Different array instances
      expect(keys1).toEqual(keys2); // Same content
    });
  });

  // =========================================================================
  // HELPER FUNCTIONS
  // =========================================================================

  describe('isValidPrimitiveType', () => {
    it('should return true for valid primitive types', () => {
      expect(isValidPrimitiveType('counter')).toBe(true);
      expect(isValidPrimitiveType('currency')).toBe(true);
      expect(isValidPrimitiveType('text')).toBe(true);
      expect(isValidPrimitiveType('number')).toBe(true);
      expect(isValidPrimitiveType('chip-group')).toBe(true);
      expect(isValidPrimitiveType('chip-group-multiple')).toBe(true);
      expect(isValidPrimitiveType('radio')).toBe(true);
      expect(isValidPrimitiveType('label')).toBe(true);
      expect(isValidPrimitiveType('date')).toBe(true);
      expect(isValidPrimitiveType('toggle')).toBe(true);
    });

    it('should return false for invalid primitive types', () => {
      expect(isValidPrimitiveType('invalid')).toBe(false);
      expect(isValidPrimitiveType('checkbox')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidPrimitiveType('')).toBe(false);
    });
  });

  describe('validatePrimitiveRequirements', () => {
    describe('types that REQUIRE options', () => {
      const typesRequiringOptions: PrimitiveType[] = [
        'chip-group',
        'chip-group-multiple',
        'radio',
        'toggle'
      ];

      test.each(typesRequiringOptions)('%s should return true when options are provided', (type) => {
        expect(validatePrimitiveRequirements(type, true)).toBe(true);
      });

      test.each(typesRequiringOptions)('%s should return false when options are NOT provided', (type) => {
        expect(validatePrimitiveRequirements(type, false)).toBe(false);
      });
    });

    describe('types that do NOT require options', () => {
      const typesNotRequiringOptions: PrimitiveType[] = [
        'counter',
        'currency',
        'text',
        'number',
        'label',
        'date'
      ];

      test.each(typesNotRequiringOptions)('%s should return true even without options', (type) => {
        expect(validatePrimitiveRequirements(type, false)).toBe(true);
      });

      test.each(typesNotRequiringOptions)('%s should return true with options (options ignored)', (type) => {
        expect(validatePrimitiveRequirements(type, true)).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should return false for invalid primitive type', () => {
        // @ts-expect-error - Testen met ongeldig type
        expect(validatePrimitiveRequirements('invalid', false)).toBe(false);
      });

      it('should handle undefined options parameter', () => {
        // @ts-expect-error - Testen met undefined
        expect(validatePrimitiveRequirements('text', undefined)).toBe(true);
      });
    });
  });

  // =========================================================================
  // TYPE SAFETY (compile-time checks in comments)
  // =========================================================================

  describe('type safety', () => {
    it('should enforce correct PrimitiveType union', () => {
      // Deze test is alleen voor type-checking, geen runtime asserts
      const validType: PrimitiveType = 'counter';
      expect(validType).toBeDefined();
      
      // @ts-expect-error - Ongeldig type mag niet compileren
      const invalidType: PrimitiveType = 'checkbox';
    });
  });
});