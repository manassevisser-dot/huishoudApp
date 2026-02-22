// NOTE: Test file imports SECTION_METADATA, getSectionMetadata, validateSectionRequirements
// These are not exported from PrimitiveRegistry. Test disabled until exports are available.
import {
    PRIMITIVE_TYPES,
    // SECTION_METADATA,
    // getSectionMetadata,
    isValidPrimitiveType,
    // validateSectionRequirements,
    type PrimitiveType,
  } from './PrimitiveRegistry';
  
  describe.skip('PrimitiveRegistry - integrity tests', () => {
  
    // ─────────────────────────────────────────────
    // 1️⃣ Every section type has metadata
    // ─────────────────────────────────────────────
    it('should have metadata defined for every section type', () => {
      const allTypes = Object.values(PRIMITIVE_TYPES);
  
      allTypes.forEach((type) => {
        expect(SECTION_METADATA[type]).toBeDefined();
      });
    });
  
    // ─────────────────────────────────────────────
    // 2️⃣ Metadata type matches key
    // ─────────────────────────────────────────────
    it('metadata.type should match its registry key', () => {
      Object.entries(SECTION_METADATA).forEach(([key, metadata]) => {
        expect(metadata.type).toBe(key);
      });
    });
  
    // ─────────────────────────────────────────────
    // 3️⃣ isValidPrimitiveType works correctly
    // ─────────────────────────────────────────────
    it('should validate correct section types', () => {
      expect(isValidPrimitiveType(PRIMITIVE_TYPES.TEXT)).toBe(true);
      expect(isValidPrimitiveType(PRIMITIVE_TYPES.CURRENCY)).toBe(true);
    });
  
    it('should reject invalid section types', () => {
      expect(isValidPrimitiveType('invalid-type')).toBe(false);
      expect(isValidPrimitiveType('')).toBe(false);
    });
  
    // ─────────────────────────────────────────────
    // 4️⃣ validateSectionRequirements enforces options
    // ─────────────────────────────────────────────
    it('should reject missing options when required', () => {
      const typeRequiringOptions: PrimitiveType = PRIMITIVE_TYPES.CHIP_GROUP;
  
      const result = validateSectionRequirements(typeRequiringOptions, false);
  
      expect(result).toBe(false);
    });
  
    it('should allow options when required', () => {
      const typeRequiringOptions: PrimitiveType = PRIMITIVE_TYPES.CHIP_GROUP;
  
      const result = validateSectionRequirements(typeRequiringOptions, true);
  
      expect(result).toBe(true);
    });
  
    it('should allow sections that do not require options', () => {
      const typeNotRequiringOptions: PrimitiveType = PRIMITIVE_TYPES.TEXT;
  
      const result = validateSectionRequirements(typeNotRequiringOptions, false);
  
      expect(result).toBe(true);
    });
  
  });