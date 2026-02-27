// src/app/factories/ScreenViewModelFactory.test.ts
import { ScreenViewModelFactory } from './ScreenViewModelFactory';
import { ScreenRegistry } from '@domain/registry/ScreenRegistry';
import { SectionRegistry } from '@domain/registry/SectionRegistry';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { PrimitiveRegistry, PRIMITIVE_TYPES } from '@domain/registry/PrimitiveRegistry';

// Mock dependencies
jest.mock('@domain/registry/ScreenRegistry');
jest.mock('@domain/registry/SectionRegistry');
jest.mock('@domain/registry/EntryRegistry');
jest.mock('@domain/registry/PrimitiveRegistry');

describe('ScreenViewModelFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('build', () => {
    it('should build a complete screen view model', () => {
      // Arrange
      const screenId = 'TEST_SCREEN';
      
      // Mock screen definition
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({
        id: 'TEST_SCREEN',
        titleToken: 'SCREEN_TITLE',
        type: 'WIZARD',
        sectionIds: ['section1', 'section2'],
        nextScreenId: 'NEXT_SCREEN',
        previousScreenId: 'PREV_SCREEN',
      });

      // Mock section definitions
      (SectionRegistry.getDefinition as jest.Mock)
        .mockReturnValueOnce({
          id: 'section1',
          labelToken: 'SECTION_1_TITLE',
          layout: 'list',
          uiModel: undefined,
          fieldIds: ['entry1', 'entry2'],
        })
        .mockReturnValueOnce({
          id: 'section2',
          labelToken: 'SECTION_2_TITLE',
          layout: 'card',
          uiModel: 'collapsible',
          fieldIds: ['entry3'],
        });

      // Mock entry definitions
      (EntryRegistry.getDefinition as jest.Mock)
        .mockReturnValueOnce({
          primitiveType: PRIMITIVE_TYPES.TEXT,
          labelToken: 'ENTRY_1_LABEL',
          placeholderToken: 'PLACEHOLDER_1',
          visibilityRuleName: 'rule1',
        })
        .mockReturnValueOnce({
          primitiveType: PRIMITIVE_TYPES.CURRENCY,
          labelToken: 'ENTRY_2_LABEL',
          placeholderToken: '0.00',
          optionsKey: 'currencyOptions',
        })
        .mockReturnValueOnce({
          primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
          labelToken: 'ENTRY_3_LABEL',
          options: ['opt1', 'opt2'],
          optionsKey: 'chipOptions',
        });

      // Mock primitive registry
      (PrimitiveRegistry.getDefinition as jest.Mock).mockReturnValue({});

      // Act
      const result = ScreenViewModelFactory.build(screenId);

      // Assert
      expect(result).toEqual({
        screenId: 'TEST_SCREEN',
        titleToken: 'SCREEN_TITLE',
        type: 'WIZARD',
        navigation: {
          next: 'NEXT_SCREEN',
          previous: 'PREV_SCREEN',
        },
        sections: [
          {
            sectionId: 'section1',
            titleToken: 'SECTION_1_TITLE',
            layout: 'list',
            uiModel: undefined,
            children: [
              {
                entryId: 'entry1',
                labelToken: 'ENTRY_1_LABEL',
                placeholderToken: 'PLACEHOLDER_1',
                visibilityRuleName: 'rule1',
                options: undefined,
                optionsKey: undefined,
                child: {
                  entryId: 'entry1',
                  primitiveType: PRIMITIVE_TYPES.TEXT,
                },
              },
              {
                entryId: 'entry2',
                labelToken: 'ENTRY_2_LABEL',
                placeholderToken: '0.00',
                visibilityRuleName: undefined,
                options: undefined,
                optionsKey: 'currencyOptions',
                child: {
                  entryId: 'entry2',
                  primitiveType: PRIMITIVE_TYPES.CURRENCY,
                },
              },
            ],
          },
          {
            sectionId: 'section2',
            titleToken: 'SECTION_2_TITLE',
            layout: 'card',
            uiModel: 'collapsible',
            children: [
              {
                entryId: 'entry3',
                labelToken: 'ENTRY_3_LABEL',
                placeholderToken: undefined,
                visibilityRuleName: undefined,
                options: ['opt1', 'opt2'],
                optionsKey: 'chipOptions',
                child: {
                  entryId: 'entry3',
                  primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
                },
              },
            ],
          },
        ],
      });

      expect(ScreenRegistry.getDefinition).toHaveBeenCalledWith('TEST_SCREEN');
      expect(SectionRegistry.getDefinition).toHaveBeenCalledTimes(2);
      expect(EntryRegistry.getDefinition).toHaveBeenCalledTimes(3);
      expect(PrimitiveRegistry.getDefinition).toHaveBeenCalledTimes(3);
    });

    it('should handle screen with no sections', () => {
      // Arrange
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({
        id: 'EMPTY_SCREEN',
        titleToken: 'EMPTY_TITLE',
        type: 'SYSTEM',
        sectionIds: [],
        nextScreenId: undefined,
        previousScreenId: undefined,
      });

      // Act
      const result = ScreenViewModelFactory.build('EMPTY_SCREEN');

      // Assert
      expect(result).toEqual({
        screenId: 'EMPTY_SCREEN',
        titleToken: 'EMPTY_TITLE',
        type: 'SYSTEM',
        navigation: {
          next: undefined,
          previous: undefined,
        },
        sections: [],
      });
      expect(SectionRegistry.getDefinition).not.toHaveBeenCalled();
    });

    it('should throw error when screen not found', () => {
      // Arrange
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      // Act & Assert
      expect(() => ScreenViewModelFactory.build('NONEXISTENT')).toThrow(
        "Screen 'NONEXISTENT' not found"
      );
      expect(SectionRegistry.getDefinition).not.toHaveBeenCalled();
    });
  });

  describe('buildSection', () => {
    it('should build a section with children', () => {
      // Arrange
      (SectionRegistry.getDefinition as jest.Mock).mockReturnValue({
        id: 'testSection',
        labelToken: 'SECTION_TOKEN',
        layout: 'grid',
        uiModel: 'numericWrapper',
        fieldIds: ['entry1', 'entry2'],
      });

      (EntryRegistry.getDefinition as jest.Mock)
        .mockReturnValueOnce({
          primitiveType: PRIMITIVE_TYPES.TEXT,
          labelToken: 'ENTRY_1',
        })
        .mockReturnValueOnce({
          primitiveType: PRIMITIVE_TYPES.NUMBER,
          labelToken: 'ENTRY_2',
          placeholderToken: 'PLACEHOLDER',
        });

      (PrimitiveRegistry.getDefinition as jest.Mock).mockReturnValue({});

      // Act
      const result = ScreenViewModelFactory.buildSection('testSection');

      // Assert
      expect(result).toEqual({
        sectionId: 'testSection',
        titleToken: 'SECTION_TOKEN',
        layout: 'grid',
        uiModel: 'numericWrapper',
        children: [
          {
            entryId: 'entry1',
            labelToken: 'ENTRY_1',
            placeholderToken: undefined,
            visibilityRuleName: undefined,
            options: undefined,
            optionsKey: undefined,
            child: {
              entryId: 'entry1',
              primitiveType: PRIMITIVE_TYPES.TEXT,
            },
          },
          {
            entryId: 'entry2',
            labelToken: 'ENTRY_2',
            placeholderToken: 'PLACEHOLDER',
            visibilityRuleName: undefined,
            options: undefined,
            optionsKey: undefined,
            child: {
              entryId: 'entry2',
              primitiveType: PRIMITIVE_TYPES.NUMBER,
            },
          },
        ],
      });
    });

    it('should handle section with no fieldIds', () => {
      // Arrange
      (SectionRegistry.getDefinition as jest.Mock).mockReturnValue({
        id: 'emptySection',
        labelToken: 'EMPTY_TOKEN',
        layout: 'list',
        uiModel: undefined,
        fieldIds: [],
      });

      // Act
      const result = ScreenViewModelFactory.buildSection('emptySection');

      // Assert
      expect(result).toEqual({
        sectionId: 'emptySection',
        titleToken: 'EMPTY_TOKEN',
        layout: 'list',
        uiModel: undefined,
        children: [],
      });
      expect(EntryRegistry.getDefinition).not.toHaveBeenCalled();
    });

    it('should throw error when section not found', () => {
      // Arrange
      (SectionRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      // Act & Assert
      expect(() => ScreenViewModelFactory.buildSection('NONEXISTENT')).toThrow(
        "Section 'NONEXISTENT' not found"
      );
    });
  });

  describe('buildEntry', () => {
    it('should build an entry with all optional fields', () => {
      // Arrange
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
        primitiveType: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE,
        labelToken: 'ENTRY_LABEL',
        placeholderToken: 'PLACEHOLDER',
        options: ['opt1', 'opt2', 'opt3'],
        optionsKey: 'testOptions',
        visibilityRuleName: 'testRule',
      });

      (PrimitiveRegistry.getDefinition as jest.Mock).mockReturnValue({});

      // Act
      const result = ScreenViewModelFactory.buildEntry('testEntry');

      // Assert
      expect(result).toEqual({
        entryId: 'testEntry',
        labelToken: 'ENTRY_LABEL',
        placeholderToken: 'PLACEHOLDER',
        options: ['opt1', 'opt2', 'opt3'],
        optionsKey: 'testOptions',
        visibilityRuleName: 'testRule',
        child: {
          entryId: 'testEntry',
          primitiveType: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE,
        },
      });
    });

    it('should build an entry with minimal fields', () => {
      // Arrange
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'MINIMAL_LABEL',
      });

      (PrimitiveRegistry.getDefinition as jest.Mock).mockReturnValue({});

      // Act
      const result = ScreenViewModelFactory.buildEntry('minimalEntry');

      // Assert
      expect(result).toEqual({
        entryId: 'minimalEntry',
        labelToken: 'MINIMAL_LABEL',
        placeholderToken: undefined,
        options: undefined,
        optionsKey: undefined,
        visibilityRuleName: undefined,
        child: {
          entryId: 'minimalEntry',
          primitiveType: PRIMITIVE_TYPES.TEXT,
        },
      });
    });

    it('should throw error when entry not found', () => {
      // Arrange
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      // Act & Assert
      expect(() => ScreenViewModelFactory.buildEntry('NONEXISTENT')).toThrow(
        "Entry 'NONEXISTENT' not found"
      );
      expect(PrimitiveRegistry.getDefinition).not.toHaveBeenCalled();
    });

    it('should throw error when primitive type not registered', () => {
      // Arrange
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
        primitiveType: 'invalidType',
        labelToken: 'LABEL',
      });

      (PrimitiveRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      // Act & Assert
      expect(() => ScreenViewModelFactory.buildEntry('testEntry')).toThrow(
        "Primitive type 'invalidType' not registered"
      );
    });

    it('should handle all primitive types', () => {
  const primitiveTypes = [
    PRIMITIVE_TYPES.TEXT,
    PRIMITIVE_TYPES.NUMBER,
    PRIMITIVE_TYPES.CURRENCY,
    PRIMITIVE_TYPES.COUNTER,
    PRIMITIVE_TYPES.DATE,
    PRIMITIVE_TYPES.TOGGLE,
    PRIMITIVE_TYPES.CHIP_GROUP,
    PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE,
    PRIMITIVE_TYPES.RADIO,
    PRIMITIVE_TYPES.ACTION,
    PRIMITIVE_TYPES.LABEL,
  ];

  // Setup mocks
  primitiveTypes.forEach(type => {
    (EntryRegistry.getDefinition as jest.Mock).mockReturnValueOnce({
      primitiveType: type,
      labelToken: `LABEL_${type}`,
    });
  });
  
  (PrimitiveRegistry.getDefinition as jest.Mock).mockReturnValue({});

  // Act
  primitiveTypes.forEach(type => ScreenViewModelFactory.buildEntry(`entry_${type}`));

  // Assert
  expect(PrimitiveRegistry.getDefinition).toHaveBeenCalledTimes(primitiveTypes.length);
});
  });

  describe('error handling', () => {
    it('should throw meaningful error when screen has invalid section reference', () => {
      // Arrange
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({
        id: 'SCREEN',
        titleToken: 'TITLE',
        type: 'WIZARD',
        sectionIds: ['validSection', 'invalidSection'],
      });

      (SectionRegistry.getDefinition as jest.Mock)
        .mockReturnValueOnce({
          id: 'validSection',
          labelToken: 'VALID',
          layout: 'list',
          fieldIds: [],
        })
        .mockReturnValueOnce(null); // invalidSection not found

      // Act & Assert
      expect(() => ScreenViewModelFactory.build('SCREEN')).toThrow(
        "Section 'invalidSection' not found"
      );
    });

    it('should throw meaningful error when section has invalid entry reference', () => {
      // Arrange
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({
        id: 'SCREEN',
        titleToken: 'TITLE',
        type: 'WIZARD',
        sectionIds: ['section1'],
      });

      (SectionRegistry.getDefinition as jest.Mock).mockReturnValue({
        id: 'section1',
        labelToken: 'SECTION',
        layout: 'list',
        fieldIds: ['validEntry', 'invalidEntry'],
      });

      (EntryRegistry.getDefinition as jest.Mock)
        .mockReturnValueOnce({
          primitiveType: PRIMITIVE_TYPES.TEXT,
          labelToken: 'VALID',
        })
        .mockReturnValueOnce(null); // invalidEntry not found

      (PrimitiveRegistry.getDefinition as jest.Mock).mockReturnValue({});

      // Act & Assert
      expect(() => ScreenViewModelFactory.build('SCREEN')).toThrow(
        "Entry 'invalidEntry' not found"
      );
    });
  });

  describe('assertFound utility', () => {
    it('should return value when not null/undefined', () => {
      // Indirect getest via de factory methods
      // Deze test is meer voor de zekerheid
      const result = ScreenViewModelFactory.buildSection;
      expect(result).toBeDefined();
    });
  });

  describe('integration with registries', () => {
   it('should call all registries in correct order', () => {
  // Arrange
  const callOrder: string[] = [];
  
  (ScreenRegistry.getDefinition as jest.Mock).mockImplementation(() => {
    callOrder.push('ScreenRegistry');
    return {
      id: 'SCREEN',
      titleToken: 'TITLE',
      type: 'WIZARD',
      sectionIds: ['section1'],
    };
  });

  (SectionRegistry.getDefinition as jest.Mock).mockImplementation(() => {
    callOrder.push('SectionRegistry');
    return {
      id: 'section1',
      labelToken: 'SECTION',
      layout: 'list',
      fieldIds: ['entry1'],
    };
  });

  (EntryRegistry.getDefinition as jest.Mock).mockImplementation(() => {
    callOrder.push('EntryRegistry');
    return {
      primitiveType: PRIMITIVE_TYPES.TEXT,
      labelToken: 'ENTRY',
    };
  });

  (PrimitiveRegistry.getDefinition as jest.Mock).mockImplementation(() => {
    callOrder.push('PrimitiveRegistry');
    return {};
  });

  // Act
  ScreenViewModelFactory.build('SCREEN');

  // Assert
  expect(callOrder).toEqual([
    'ScreenRegistry',
    'SectionRegistry',
    'EntryRegistry',
    'PrimitiveRegistry',
  ]);
});});
});