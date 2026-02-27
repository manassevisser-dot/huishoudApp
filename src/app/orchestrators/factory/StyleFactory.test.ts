// src/app/factories/ScreenStyleFactory.test.ts
import { ScreenStyleFactory, StyleResolver, StyleKeyStrategy } from './StyleFactory';
import type {
  ScreenViewModel,
  SectionViewModel,
  EntryViewModel,
  PrimitiveViewModel,
} from '@app/orchestrators/factory/ScreenViewModelFactory';
import { PRIMITIVE_TYPES } from '@domain/registry/PrimitiveRegistry';

// Mock style object type
type StyleObject = Record<string, unknown>;

describe('ScreenStyleFactory', () => {
  // Test data
  const mockStyles: Record<string, StyleObject> = {
    'screen.type:WIZARD': { backgroundColor: 'blue', padding: 20 },
    'screen.type:APP_STATIC': { backgroundColor: 'white' },
    'section.layout:list': { borderWidth: 1, margin: 10 },
    'section.layout:grid|ui:numericWrapper': { flexWrap: 'wrap', gap: 8 },
    'entry:entry1': { marginVertical: 5 },
    'entry:entry2': { marginVertical: 10 },
    'primitive:text': { fontSize: 16, color: 'black' },
    'primitive:currency': { fontSize: 18, fontWeight: 'bold' },
    'primitive:action': { backgroundColor: 'blue', padding: 12 },
  };

  const mockResolver: StyleResolver = {
    getStyle: jest.fn((key: string) => mockStyles[key]),
  };

  const customKeyStrategy: StyleKeyStrategy = {
    screenKey: (screen) => `custom:screen:${screen.screenId}`,
    sectionKey: (section) => `custom:section:${section.sectionId}`,
    entryKey: (entry) => `custom:entry:${entry.entryId}`,
    primitiveKey: (prim) => `custom:primitive:${prim.primitiveType}`,
  };

  const mockScreen: ScreenViewModel = {
    screenId: 'TEST_SCREEN',
    titleToken: 'TEST_TITLE',
    type: 'WIZARD',
    navigation: { next: 'NEXT', previous: 'PREV' },
    sections: [
      {
        sectionId: 'section1',
        titleToken: 'SECTION_1',
        layout: 'list',
        uiModel: undefined,
        children: [
          {
            entryId: 'entry1',
            labelToken: 'ENTRY_1',
            placeholderToken: undefined,
            options: undefined,
            optionsKey: undefined,
            visibilityRuleName: undefined,
            child: {
              entryId: 'entry1',
              primitiveType: PRIMITIVE_TYPES.TEXT,
            },
          },
          {
            entryId: 'entry2',
            labelToken: 'ENTRY_2',
            placeholderToken: 'PLACEHOLDER',
            options: undefined,
            optionsKey: undefined,
            visibilityRuleName: undefined,
            child: {
              entryId: 'entry2',
              primitiveType: PRIMITIVE_TYPES.CURRENCY,
            },
          },
        ],
      },
      {
        sectionId: 'section2',
        titleToken: 'SECTION_2',
        layout: 'grid',
        uiModel: 'numericWrapper',
        children: [
          {
            entryId: 'entry3',
            labelToken: 'ENTRY_3',
            placeholderToken: undefined,
            options: undefined,
            optionsKey: undefined,
            visibilityRuleName: undefined,
            child: {
              entryId: 'entry3',
              primitiveType: PRIMITIVE_TYPES.ACTION,
            },
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bind', () => {
    it('should apply styles to entire screen hierarchy using default key strategy', () => {
      // Act
      const result = ScreenStyleFactory.bind(mockScreen, mockResolver);

      // Assert - screen style
      expect(result.style).toEqual({ backgroundColor: 'blue', padding: 20 });
      
      // Assert - section styles
      expect(result.sections[0].style).toEqual({ borderWidth: 1, margin: 10 });
      expect(result.sections[1].style).toEqual({ flexWrap: 'wrap', gap: 8 });
      
      // Assert - entry styles
      expect(result.sections[0].children[0].style).toEqual({ marginVertical: 5 });
      expect(result.sections[0].children[1].style).toEqual({ marginVertical: 10 });
      expect(result.sections[1].children[0].style).toBeUndefined(); // No style for entry3
      
      // Assert - primitive styles
      expect(result.sections[0].children[0].child.style).toEqual({ fontSize: 16, color: 'black' });
      expect(result.sections[0].children[1].child.style).toEqual({ fontSize: 18, fontWeight: 'bold' });
      expect(result.sections[1].children[0].child.style).toEqual({ backgroundColor: 'blue', padding: 12 });

      // Verify resolver calls
      expect(mockResolver.getStyle).toHaveBeenCalledWith('screen.type:WIZARD');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('section.layout:list');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('section.layout:grid|ui:numericWrapper');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('entry:entry1');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('entry:entry2');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('entry:entry3');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('primitive:text');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('primitive:currency');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('primitive:action');
    });

    it('should use custom key strategy when provided', () => {
      // Act
      const result = ScreenStyleFactory.bind(mockScreen, mockResolver, customKeyStrategy);

      // Assert - resolver called with custom keys
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:screen:TEST_SCREEN');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:section:section1');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:section:section2');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:entry:entry1');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:entry:entry2');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:entry:entry3');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:primitive:text');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:primitive:currency');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('custom:primitive:action');
    });

    it('should handle undefined styles gracefully', () => {
      // Arrange
      const emptyResolver: StyleResolver = {
        getStyle: jest.fn(() => undefined),
      };

      // Act
      const result = ScreenStyleFactory.bind(mockScreen, emptyResolver);

      // Assert
      expect(result.style).toBeUndefined();
      expect(result.sections[0].style).toBeUndefined();
      expect(result.sections[0].children[0].style).toBeUndefined();
      expect(result.sections[0].children[0].child.style).toBeUndefined();
    });

    it('should preserve all non-style properties', () => {
      // Act
      const result = ScreenStyleFactory.bind(mockScreen, mockResolver);

      // Assert - screen properties preserved
      expect(result.screenId).toBe('TEST_SCREEN');
      expect(result.titleToken).toBe('TEST_TITLE');
      expect(result.type).toBe('WIZARD');
      expect(result.navigation).toEqual({ next: 'NEXT', previous: 'PREV' });

      // Assert - section properties preserved
      expect(result.sections[0].sectionId).toBe('section1');
      expect(result.sections[0].titleToken).toBe('SECTION_1');
      expect(result.sections[0].layout).toBe('list');
      expect(result.sections[0].uiModel).toBeUndefined();

      // Assert - entry properties preserved
      expect(result.sections[0].children[0].entryId).toBe('entry1');
      expect(result.sections[0].children[0].labelToken).toBe('ENTRY_1');
      expect(result.sections[0].children[0].child.primitiveType).toBe(PRIMITIVE_TYPES.TEXT);
    });
  });

  describe('defaultKeyStrategy', () => {
    it('should generate correct screen keys', () => {
      // This is indirectly tested through bind, but we can test directly
      const strategy = (ScreenStyleFactory as any).defaultKeyStrategy;
      
      expect(strategy.screenKey({ type: 'WIZARD' } as ScreenViewModel)).toBe('screen.type:WIZARD');
      expect(strategy.screenKey({ type: 'APP_STATIC' } as ScreenViewModel)).toBe('screen.type:APP_STATIC');
    });

    it('should generate correct section keys with and without uiModel', () => {
      const strategy = (ScreenStyleFactory as any).defaultKeyStrategy;
      
      const sectionWithUiModel: SectionViewModel = {
        layout: 'grid',
        uiModel: 'numericWrapper',
      } as SectionViewModel;
      
      const sectionWithoutUiModel: SectionViewModel = {
        layout: 'list',
        uiModel: undefined,
      } as SectionViewModel;

      expect(strategy.sectionKey(sectionWithUiModel)).toBe('section.layout:grid|ui:numericWrapper');
      expect(strategy.sectionKey(sectionWithoutUiModel)).toBe('section.layout:list');
    });

    it('should generate correct entry keys', () => {
      const strategy = (ScreenStyleFactory as any).defaultKeyStrategy;
      
      const entry: EntryViewModel = {
        entryId: 'testEntry',
      } as EntryViewModel;

      expect(strategy.entryKey(entry)).toBe('entry:testEntry');
    });

    it('should generate correct primitive keys', () => {
      const strategy = (ScreenStyleFactory as any).defaultKeyStrategy;
      
      const primitive: PrimitiveViewModel = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
      } as PrimitiveViewModel;

      expect(strategy.primitiveKey(primitive)).toBe('primitive:text');
    });
  });

  describe('edge cases', () => {
    it('should handle screen with empty sections array', () => {
      // Arrange
      const screenWithNoSections: ScreenViewModel = {
        ...mockScreen,
        sections: [],
      };

      // Act
      const result = ScreenStyleFactory.bind(screenWithNoSections, mockResolver);

      // Assert
      expect(result.sections).toEqual([]);
      expect(mockResolver.getStyle).toHaveBeenCalledWith('screen.type:WIZARD');
      // No section/entry/primitive calls
      expect(mockResolver.getStyle).toHaveBeenCalledTimes(1);
    });

    it('should handle section with empty children array', () => {
      // Arrange
      const screenWithEmptySection: ScreenViewModel = {
        ...mockScreen,
        sections: [{
          ...mockScreen.sections[0],
          children: [],
        }],
      };

      // Act
      const result = ScreenStyleFactory.bind(screenWithEmptySection, mockResolver);

      // Assert
      expect(result.sections[0].children).toEqual([]);
      expect(mockResolver.getStyle).toHaveBeenCalledWith('screen.type:WIZARD');
      expect(mockResolver.getStyle).toHaveBeenCalledWith('section.layout:list');
      // No entry/primitive calls for empty section
    });

    it('should handle missing styles for some keys', () => {
      // Arrange
      const partialResolver: StyleResolver = {
        getStyle: jest.fn((key: string) => {
          if (key === 'screen.type:WIZARD') return { backgroundColor: 'red' };
          if (key === 'primitive:text') return { fontSize: 12 };
          return undefined;
        }),
      };

      // Act
      const result = ScreenStyleFactory.bind(mockScreen, partialResolver);

      // Assert
      expect(result.style).toEqual({ backgroundColor: 'red' });
      expect(result.sections[0].style).toBeUndefined();
      expect(result.sections[0].children[0].style).toBeUndefined();
      expect(result.sections[0].children[0].child.style).toEqual({ fontSize: 12 });
    });

    it('should be pure - same input always returns structurally same output', () => {
      // Arrange
      const result1 = ScreenStyleFactory.bind(mockScreen, mockResolver);
      const result2 = ScreenStyleFactory.bind(mockScreen, mockResolver);

      // Assert - not same reference but equal structure
      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe('type safety', () => {
    it('should maintain correct types through binding', () => {
      // Act
      const result = ScreenStyleFactory.bind(mockScreen, mockResolver);

      // Assert - TypeScript zou dit moeten accepteren
      const screenId: string = result.screenId;
      const firstSectionLayout: string = result.sections[0].layout;
      const firstEntryId: string = result.sections[0].children[0].entryId;
      const firstPrimitiveType: string = result.sections[0].children[0].child.primitiveType;

      expect(screenId).toBe('TEST_SCREEN');
      expect(firstSectionLayout).toBe('list');
      expect(firstEntryId).toBe('entry1');
      expect(firstPrimitiveType).toBe(PRIMITIVE_TYPES.TEXT);
    });
  });
});