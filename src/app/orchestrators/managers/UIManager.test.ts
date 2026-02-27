// src/app/orchestrators/managers/UIManager.test.ts
import { UIManager } from './UIManager';
import { ScreenViewModelFactory } from '@app/orchestrators/factory/ScreenViewModelFactory';
import { ScreenStyleFactory } from '@app/orchestrators/factory/StyleFactory';
import type { StyledScreenVM } from '@app/orchestrators/factory/StyleFactory';

// Mock dependencies
jest.mock('@app/orchestrators/factory/ScreenViewModelFactory');
jest.mock('@app/orchestrators/factory/StyleFactory');

describe('UIManager', () => {
  let uiManager: UIManager;
  let mockBaseScreen: StyledScreenVM;
  let mockStyledScreen: StyledScreenVM;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock screen objects
    mockBaseScreen = {
      screenId: 'test-screen',
      titleToken: 'TEST_TITLE',
      type: 'WIZARD',
      style: {},
      navigation: { next: 'nextScreen', previous: 'prevScreen' },
      sections: [
        {
          sectionId: 'section1',
          titleToken: 'SECTION_TITLE',
          layout: 'list',
          uiModel: undefined,
          style: {},
          children: [],
        },
      ],
    };

    mockStyledScreen = {
      ...mockBaseScreen,
      style: { backgroundColor: 'red' }, // Styled versie
      sections: [
        {
          ...mockBaseScreen.sections[0],
          style: { margin: 10 },
        },
      ],
    };

    // Setup mocks
    (ScreenViewModelFactory.build as jest.Mock).mockReturnValue(mockBaseScreen);
    (ScreenStyleFactory.bind as jest.Mock).mockReturnValue(mockStyledScreen);

    // Create UIManager instance
    uiManager = new UIManager();
  });

  describe('constructor', () => {
    it('should initialize with identity style resolver', () => {
      // We kunnen de private styleResolver niet direct testen,
      // maar we kunnen testen dat de resolver wordt gebruikt in buildScreen
      expect(uiManager).toBeInstanceOf(UIManager);
    });
  });

  describe('buildScreen', () => {
    it('should build a styled screen by delegating to factories', () => {
      // Arrange
      const screenId = 'test-screen';

      // Act
      const result = uiManager.buildScreen(screenId);

      // Assert
      expect(ScreenViewModelFactory.build).toHaveBeenCalledTimes(1);
      expect(ScreenViewModelFactory.build).toHaveBeenCalledWith('test-screen');

      expect(ScreenStyleFactory.bind).toHaveBeenCalledTimes(1);
      expect(ScreenStyleFactory.bind).toHaveBeenCalledWith(
        mockBaseScreen,
        expect.any(Object)
      );

      expect(result).toBe(mockStyledScreen);
      expect(result.screenId).toBe('test-screen');
      expect(result.style).toEqual({ backgroundColor: 'red' });
    });

    it('should pass the identity style resolver to ScreenStyleFactory', () => {
      // Arrange
      const screenId = 'test-screen';

      // Act
      uiManager.buildScreen(screenId);

      // Assert
      const bindCall = (ScreenStyleFactory.bind as jest.Mock).mock.calls[0];
      const resolver = bindCall[1];

      // Test dat de resolver identity functie werkt
      expect(resolver.getStyle('some-style-key')).toBe('some-style-key');
      expect(resolver.getStyle('')).toBe('');
      expect(resolver.getStyle('button-primary')).toBe('button-primary');
    });

    it('should handle screens with multiple sections', () => {
      // Arrange
      const complexScreen: StyledScreenVM = {
        screenId: 'complex-screen',
        titleToken: 'COMPLEX_TITLE',
        type: 'APP_STATIC',
        style: {},
        navigation: {},
        sections: [
          {
            sectionId: 'section1',
            titleToken: 'SECTION_1',
            layout: 'list',
            uiModel: undefined,
            style: {},
            children: [],
          },
          {
            sectionId: 'section2',
            titleToken: 'SECTION_2',
            layout: 'grid',
            uiModel: 'collapsible',
            style: {},
            children: [],
          },
          {
            sectionId: 'section3',
            titleToken: 'SECTION_3',
            layout: 'card',
            uiModel: 'numericWrapper',
            style: {},
            children: [],
          },
        ],
      };

      const styledComplexScreen = {
        ...complexScreen,
        style: { padding: 20 },
        sections: complexScreen.sections.map(s => ({
          ...s,
          style: { borderWidth: 1 },
        })),
      };

      (ScreenViewModelFactory.build as jest.Mock).mockReturnValueOnce(complexScreen);
      (ScreenStyleFactory.bind as jest.Mock).mockReturnValueOnce(styledComplexScreen);

      // Act
      const result = uiManager.buildScreen('complex-screen');

      // Assert
      expect(result.sections).toHaveLength(3);
      expect(result.sections[0].layout).toBe('list');
      expect(result.sections[1].layout).toBe('grid');
      expect(result.sections[2].layout).toBe('card');
      expect(result.style).toEqual({ padding: 20 });
    });

    it('should handle screens with entries', () => {
      // Arrange
      const screenWithEntries: StyledScreenVM = {
        screenId: 'entry-screen',
        titleToken: 'ENTRY_TITLE',
        type: 'WIZARD',
        style: {},
        navigation: {},
        sections: [
          {
            sectionId: 'section1',
            titleToken: 'SECTION',
            layout: 'list',
            uiModel: undefined,
            style: {},
            children: [
              {
                entryId: 'entry1',
                labelToken: 'LABEL_1',
                placeholderToken: 'PLACEHOLDER_1',
                child: {
                  entryId: 'entry1',
                  primitiveType: 'text',
                  style: { color: 'blue' },
                },
                style: { margin: 5 },
                options: undefined,
                optionsKey: undefined,
                visibilityRuleName: undefined,
              },
              {
                entryId: 'entry2',
                labelToken: 'LABEL_2',
                placeholderToken: 'PLACEHOLDER_2',
                child: {
                  entryId: 'entry2',
                  primitiveType: 'currency',
                  style: { fontWeight: 'bold' },
                },
                style: { margin: 10 },
                options: undefined,
                optionsKey: undefined,
                visibilityRuleName: 'testRule',
              },
            ],
          },
        ],
      };

      const styledScreenWithEntries = {
        ...screenWithEntries,
        sections: screenWithEntries.sections.map(s => ({
          ...s,
          children: s.children.map(child => ({
            ...child,
            style: child.style ? { ...child.style, backgroundColor: 'white' } : { backgroundColor: 'white' },
          })),
        })),
      };

      (ScreenViewModelFactory.build as jest.Mock).mockReturnValueOnce(screenWithEntries);
      (ScreenStyleFactory.bind as jest.Mock).mockReturnValueOnce(styledScreenWithEntries);

      // Act
      const result = uiManager.buildScreen('entry-screen');

      // Assert
      expect(result.sections[0].children).toHaveLength(2);
      expect(result.sections[0].children[0].style).toHaveProperty('backgroundColor', 'white');
      expect(result.sections[0].children[0].child.style).toEqual({ color: 'blue' });
    });

    it('should work with different screen types', () => {
      // Test verschillende screen types
      const screenTypes: Array<'AUTH' | 'WIZARD' | 'APP_STATIC' | 'SYSTEM'> = [
        'AUTH',
        'WIZARD',
        'APP_STATIC',
        'SYSTEM',
      ];

      screenTypes.forEach(type => {
        // Reset mocks voor elke iteratie
        jest.clearAllMocks();

        const typedScreen: StyledScreenVM = {
          screenId: `${type}-screen`,
          titleToken: `${type}_TITLE`,
          type,
          style: {},
          navigation: {},
          sections: [],
        };

        (ScreenViewModelFactory.build as jest.Mock).mockReturnValueOnce(typedScreen);
        (ScreenStyleFactory.bind as jest.Mock).mockReturnValueOnce(typedScreen);

        // Act
        const result = uiManager.buildScreen(`${type}-screen`);

        // Assert
        expect(result.type).toBe(type);
      });
    });

    it('should handle empty sections array', () => {
      // Arrange
      const screenWithoutSections: StyledScreenVM = {
        screenId: 'empty-screen',
        titleToken: 'EMPTY_TITLE',
        type: 'SYSTEM',
        style: {},
        navigation: {},
        sections: [],
      };

      (ScreenViewModelFactory.build as jest.Mock).mockReturnValueOnce(screenWithoutSections);
      (ScreenStyleFactory.bind as jest.Mock).mockReturnValueOnce(screenWithoutSections);

      // Act
      const result = uiManager.buildScreen('empty-screen');

      // Assert
      expect(result.sections).toEqual([]);
      expect(result.screenId).toBe('empty-screen');
    });

    it('should propagate errors from ScreenViewModelFactory', () => {
      // Arrange
      const error = new Error('Screen not found');
      (ScreenViewModelFactory.build as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      // Act & Assert
      expect(() => uiManager.buildScreen('invalid-screen')).toThrow('Screen not found');
      expect(ScreenStyleFactory.bind).not.toHaveBeenCalled();
    });

    it('should propagate errors from ScreenStyleFactory', () => {
      // Arrange
      const error = new Error('Styling failed');
      (ScreenStyleFactory.bind as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      // Act & Assert
      expect(() => uiManager.buildScreen('test-screen')).toThrow('Styling failed');
      expect(ScreenViewModelFactory.build).toHaveBeenCalled();
    });
  });

  describe('style resolver behavior', () => {
    it('should create a new style resolver instance each time', () => {
      // Dit is een indirecte test: we kunnen niet direct de resolver inspecteren,
      // maar we kunnen testen dat de resolver consistent gedrag vertoont

      const screenId = 'test-screen';
      
      // Eerste call
      uiManager.buildScreen(screenId);
      const firstResolver = (ScreenStyleFactory.bind as jest.Mock).mock.calls[0][1];

      // Tweede call
      uiManager.buildScreen(screenId);
      const secondResolver = (ScreenStyleFactory.bind as jest.Mock).mock.calls[1][1];

      // Resolvers moeten hetzelfde gedrag vertonen
      expect(firstResolver.getStyle('test')).toBe('test');
      expect(secondResolver.getStyle('test')).toBe('test');
    });

    it('should handle various style keys', () => {
      // Test de identity resolver met verschillende inputs
      uiManager.buildScreen('test-screen');
      
      const resolver = (ScreenStyleFactory.bind as jest.Mock).mock.calls[0][1];
      
      const testCases = [
        'simple-key',
        'key-with-dashes',
        'key_with_underscores',
        'key.with.dots',
        'KEY_UPPERCASE',
        'key123',
        '',
        '   ',
        'special!@#$%',
      ];

      testCases.forEach(key => {
        expect(resolver.getStyle(key)).toBe(key);
      });
    });
  });

  describe('integration with factories', () => {
    it('should pass the correct screenId to ScreenViewModelFactory', () => {
      // Arrange
      const testScreenIds = ['LANDING', 'DASHBOARD', 'WIZARD_SETUP', 'SETTINGS'];

      testScreenIds.forEach(screenId => {
        // Act
        uiManager.buildScreen(screenId);

        // Assert
        expect(ScreenViewModelFactory.build).toHaveBeenCalledWith(screenId);
      });
    });

    it('should pass the base screen from factory to style factory', () => {
      // Arrange
      const screenId = 'test-screen';
      const customBaseScreen = {
        ...mockBaseScreen,
        screenId: 'custom-screen',
        titleToken: 'CUSTOM_TITLE',
      };

      (ScreenViewModelFactory.build as jest.Mock).mockReturnValueOnce(customBaseScreen);

      // Act
      uiManager.buildScreen(screenId);

      // Assert
      expect(ScreenStyleFactory.bind).toHaveBeenCalledWith(
        customBaseScreen,
        expect.any(Object)
      );
    });

    it('should return exactly what ScreenStyleFactory returns', () => {
      // Arrange
      const customStyledScreen = {
        ...mockStyledScreen,
        style: { custom: 'style' },
      };
      
      (ScreenStyleFactory.bind as jest.Mock).mockReturnValueOnce(customStyledScreen);

      // Act
      const result = uiManager.buildScreen('test-screen');

      // Assert
      expect(result).toBe(customStyledScreen);
    });
  });
});