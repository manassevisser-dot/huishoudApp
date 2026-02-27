// src/app/orchestrators/UIOrchestrator.test.ts
import { UIOrchestrator, MappingContext } from './UIOrchestrator';
import { VisibilityOrchestrator } from './VisibilityOrchestrator';
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { StyledScreenVM, StyledSectionVM, StyledEntryVM } from '@app/orchestrators/factory/StyleFactory';
import type { RenderScreenVM, RenderEntryVM } from './types/render.types';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { labelFromToken } from '@domain/constants/labelResolver';

// Mock dependencies
jest.mock('./managers/UIManager', () => ({
  UIManager: jest.fn().mockImplementation(() => ({
    buildScreen: jest.fn(),
  })),
}));

jest.mock('@domain/registry/EntryRegistry', () => ({
  EntryRegistry: {
    getDefinition: jest.fn(),
  },
  resolveFieldId: jest.fn((id) => id),
}));

jest.mock('@domain/constants/labelResolver', () => ({
  labelFromToken: jest.fn((token) => `Resolved: ${token}`),
}));

describe('UIOrchestrator', () => {
  let mockVisibility: jest.Mocked<VisibilityOrchestrator>;
  let orchestrator: UIOrchestrator;
  let mockContext: MappingContext;
  let mockFso: jest.Mocked<FormStateOrchestrator>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock VisibilityOrchestrator
    mockVisibility = {
      evaluate: jest.fn(),
    } as any;

    // Create orchestrator with mock visibility
    orchestrator = new UIOrchestrator(mockVisibility);

    // Create mock FormStateOrchestrator
    mockFso = {
      getValue: jest.fn(),
    } as any;

    // Create mock context
    mockContext = {
      fso: mockFso,
      onFieldChange: jest.fn(),
      onNavigate: jest.fn(),
      onCommand: jest.fn(),
    };
  });

  describe('constructor', () => {
    it('should initialize with injected VisibilityOrchestrator', () => {
      expect(orchestrator).toBeInstanceOf(UIOrchestrator);
      expect(orchestrator['visibility']).toBe(mockVisibility);
    });
  });

  describe('buildScreen', () => {
    it('should delegate to UIManager.buildScreen', () => {
      // Arrange
      const mockStyledScreen: StyledScreenVM = {
        screenId: 'test-screen',
        titleToken: 'TITLE',
        type: 'WIZARD',
        style: {},
        navigation: {},
        sections: [],
      };
      
      const uiManagerMock = orchestrator['uiManager'];
      (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(mockStyledScreen);

      // Act
      const result = orchestrator.buildScreen('test-screen');

      // Assert
      expect(uiManagerMock.buildScreen).toHaveBeenCalledWith('test-screen');
      expect(result).toBe(mockStyledScreen);
    });
  });

  describe('buildRenderScreen', () => {
    it('should build render-ready screen from styled screen', () => {
  // Arrange
  const mockStyledScreen: StyledScreenVM = {
    screenId: 'test-screen',
    titleToken: 'SCREEN_TITLE',
    type: 'WIZARD',
    style: { backgroundColor: 'red' },
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

  // Mock buildScreen to return styled screen
  const uiManagerMock = orchestrator['uiManager'];
  (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(mockStyledScreen);

  // Mock label resolver
  (labelFromToken as jest.Mock).mockImplementation(token => `Resolved: ${token}`);

  // Act
  const result = orchestrator.buildRenderScreen('test-screen', mockContext);

  // Assert - ✅ FIXED: Verwachting aangepast naar next/previous
  expect(result).toEqual({
    screenId: 'test-screen',
    title: 'Resolved: SCREEN_TITLE',
    type: 'WIZARD',
    style: { backgroundColor: 'red' },
    navigation: { next: 'nextScreen', previous: 'prevScreen' },  // ← Vervang canGoBack
    sections: [
      {
        sectionId: 'section1',
        title: 'Resolved: SECTION_TITLE',
        layout: 'list',
        uiModel: undefined,
        style: {},
        children: [],
      },
    ],
  });
});

    it('should map entries with visibility and values', () => {
      // Arrange
      const mockStyledScreen: StyledScreenVM = {
        screenId: 'test-screen',
        titleToken: 'TITLE',
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
                entryId: 'testEntry',
                labelToken: 'ENTRY_LABEL',
                placeholderToken: 'PLACEHOLDER',
                child: {entryId: 'testEntry', primitiveType: 'text', style: {} },
                style: { margin: 10 },
                options: undefined,
                optionsKey: undefined,
                visibilityRuleName: 'testRule',
              },
            ],
          },
        ],
      };

      // Mock dependencies
      const uiManagerMock = orchestrator['uiManager'];
      (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(mockStyledScreen);

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
        primitiveType: 'text',
        constraintsKey: 'testConstraint',
      });

      mockVisibility.evaluate.mockReturnValue(true);
      mockFso.getValue.mockReturnValue('test value');

      // Act
      const result = orchestrator.buildRenderScreen('test-screen', mockContext);

      // Assert
      expect(result.sections[0].children[0]).toMatchObject({
        entryId: 'testEntry',
        fieldId: 'testEntry',
        label: 'Resolved: ENTRY_LABEL',
        placeholder: 'PLACEHOLDER',
        primitiveType: 'text',
        value: 'test value',
        isVisible: true,
      });

      expect(mockVisibility.evaluate).toHaveBeenCalledWith('testRule');
      expect(mockFso.getValue).toHaveBeenCalledWith('testEntry');
    });
  });

  describe('isVisible', () => {
    it('should delegate to VisibilityOrchestrator.evaluate', () => {
      // Arrange
      mockVisibility.evaluate.mockReturnValue(true);

      // Act
      const result = orchestrator.isVisible('testRule', 'member1');

      // Assert
      expect(mockVisibility.evaluate).toHaveBeenCalledWith('testRule', 'member1');
      expect(result).toBe(true);
    });

    it('should handle calls without memberId', () => {
      // Arrange
      mockVisibility.evaluate.mockReturnValue(false);

      // Act
      const result = orchestrator.isVisible('testRule');

      // Assert
      expect(mockVisibility.evaluate).toHaveBeenCalledWith('testRule', undefined);
      expect(result).toBe(false);
    });
  });

  describe('entry mapping', () => {
    const createMockEntry = (overrides = {}): StyledEntryVM => ({
      entryId: 'testEntry',
      labelToken: 'LABEL',
      placeholderToken: 'PLACEHOLDER',
      child: {entryId: 'testEntry', primitiveType: 'text', style: {} },
      style: {},
      options: undefined,
      optionsKey: undefined,
      visibilityRuleName: undefined,
      ...overrides,
    });

    it('should throw error when entry definition not found', () => {
      // Arrange
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      const styledScreen: StyledScreenVM = {
        screenId: 'test',
        titleToken: 'TITLE',
        type: 'WIZARD',
        style: {},
        navigation: {},
        sections: [{
          sectionId: 'section',
          titleToken: 'SECTION',
          layout: 'list',
          uiModel: undefined,
          style: {},
          children: [createMockEntry()],
        }],
      };

      const uiManagerMock = orchestrator['uiManager'];
      (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(styledScreen);

      // Act & Assert
      expect(() => {
        orchestrator.buildRenderScreen('test', mockContext);
      }).toThrow("Entry 'testEntry' not found in EntryRegistry");
    });

    describe('action entries', () => {
      it('should handle action entries with navigationTarget', () => {
        // Arrange
        (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
          primitiveType: 'action',
          navigationTarget: 'TARGET_SCREEN',
        });

        const mockEntry = createMockEntry({
          child: { primitiveType: 'action', style: {} },
        });

        const styledScreen = createScreenWithEntry(mockEntry);
        const uiManagerMock = orchestrator['uiManager'];
        (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(styledScreen);

        // Act
        const result = orchestrator.buildRenderScreen('test', mockContext);
        const entry = result.sections[0].children[0] as RenderEntryVM;

        // Assert
        expect(entry.primitiveType).toBe('action');
        expect(entry.isVisible).toBe(true);
        expect(entry.value).toBeUndefined();

        // Call onChange handler
        entry.onChange('some value');
        expect(mockContext.onNavigate).toHaveBeenCalledWith('TARGET_SCREEN');
        expect(mockContext.onCommand).not.toHaveBeenCalled();
        expect(mockContext.onFieldChange).not.toHaveBeenCalled();
      });

      it('should handle action entries with commandTarget (priority over navigation)', () => {
        // Arrange
        (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
          primitiveType: 'action',
          navigationTarget: 'TARGET_SCREEN',
          commandTarget: 'UNDO_ACTION',
        });

        const mockEntry = createMockEntry({
          child: { primitiveType: 'action', style: {} },
        });

        const styledScreen = createScreenWithEntry(mockEntry);
        const uiManagerMock = orchestrator['uiManager'];
        (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(styledScreen);

        // Act
        const result = orchestrator.buildRenderScreen('test', mockContext);
        const entry = result.sections[0].children[0] as RenderEntryVM;

        // Assert
        // Call onChange handler
        entry.onChange('some value');
        expect(mockContext.onCommand).toHaveBeenCalledWith('UNDO_ACTION');
        expect(mockContext.onNavigate).not.toHaveBeenCalled();
      });
    });

    describe('field entries', () => {
      it('should handle visible field entries with value', () => {
        // Arrange
        (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
          primitiveType: 'text',
        });

        mockVisibility.evaluate.mockReturnValue(true);
        mockFso.getValue.mockReturnValue('field value');

        const mockEntry = createMockEntry({
          child: { primitiveType: 'text', style: {} },
          visibilityRuleName: 'testRule',
        });

        const styledScreen = createScreenWithEntry(mockEntry);
        const uiManagerMock = orchestrator['uiManager'];
        (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(styledScreen);

        // Act
        const result = orchestrator.buildRenderScreen('test', mockContext);
        const entry = result.sections[0].children[0] as RenderEntryVM;

        // Assert
        expect(entry.value).toBe('field value');
        expect(entry.isVisible).toBe(true);

        // Call onChange handler
        entry.onChange('new value');
        expect(mockContext.onFieldChange).toHaveBeenCalledWith('testEntry', 'new value');
      });

      it('should handle invisible field entries (value undefined)', () => {
        // Arrange
        (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
          primitiveType: 'text',
        });

        mockVisibility.evaluate.mockReturnValue(false);

        const mockEntry = createMockEntry({
          child: { primitiveType: 'text', style: {} },
          visibilityRuleName: 'testRule',
        });

        const styledScreen = createScreenWithEntry(mockEntry);
        const uiManagerMock = orchestrator['uiManager'];
        (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(styledScreen);

        // Act
        const result = orchestrator.buildRenderScreen('test', mockContext);
        const entry = result.sections[0].children[0] as RenderEntryVM;

        // Assert
        expect(entry.value).toBeUndefined();
        expect(entry.isVisible).toBe(false);
        expect(mockFso.getValue).not.toHaveBeenCalled();
      });
    });

    describe('resolveFieldId', () => {
      it('should use constraintsKey when available', () => {
        // Arrange
        (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
          primitiveType: 'text',
          constraintsKey: 'customFieldId',
        });

        const { resolveFieldId } = jest.requireMock('@domain/registry/EntryRegistry');
        resolveFieldId.mockReturnValue('customFieldId');

        const mockEntry = createMockEntry();
        const styledScreen = createScreenWithEntry(mockEntry);
        const uiManagerMock = orchestrator['uiManager'];
        (uiManagerMock.buildScreen as jest.Mock).mockReturnValue(styledScreen);

        // Act
        const result = orchestrator.buildRenderScreen('test', mockContext);
        const entry = result.sections[0].children[0] as RenderEntryVM;

        // Assert
        expect(resolveFieldId).toHaveBeenCalled();
        expect(entry.fieldId).toBe('customFieldId');
      });
    });
  });

  describe('evaluateVisibility', () => {
    it('should return true for undefined ruleName', () => {
      // Act
      const result = orchestrator['evaluateVisibility'](undefined);

      // Assert
      expect(result).toBe(true);
      expect(mockVisibility.evaluate).not.toHaveBeenCalled();
    });

    it('should return true for empty ruleName', () => {
      // Act
      const result = orchestrator['evaluateVisibility']('');

      // Assert
      expect(result).toBe(true);
      expect(mockVisibility.evaluate).not.toHaveBeenCalled();
    });

    it('should delegate to visibility.evaluate for non-empty rule', () => {
      // Arrange
      mockVisibility.evaluate.mockReturnValue(false);

      // Act
      const result = orchestrator['evaluateVisibility']('testRule');

      // Assert
      expect(mockVisibility.evaluate).toHaveBeenCalledWith('testRule');
      expect(result).toBe(false);
    });
  });
});

// Helper function to create a screen with a single entry
function createScreenWithEntry(entry: StyledEntryVM): StyledScreenVM {
  return {
    screenId: 'test',
    titleToken: 'TITLE',
    type: 'WIZARD',
    style: {},
    navigation: {},
    sections: [{
      sectionId: 'section',
      titleToken: 'SECTION',
      layout: 'list',
      uiModel: undefined,
      style: {},
      children: [entry],
    }],
  };
}