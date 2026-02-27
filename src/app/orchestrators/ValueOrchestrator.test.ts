// src/app/orchestrators/ValueOrchestrator.test.ts
import { ValueOrchestrator } from './ValueOrchestrator';
import { FormStateOrchestrator } from './FormStateOrchestrator';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { PRIMITIVE_TYPES } from '@domain/registry/PrimitiveRegistry';

// Mock dependencies
jest.mock('./FormStateOrchestrator');
jest.mock('@domain/registry/EntryRegistry');

describe('ValueOrchestrator', () => {
  let mockFso: jest.Mocked<FormStateOrchestrator>;
  let orchestrator: ValueOrchestrator;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock FormStateOrchestrator
    mockFso = {
      getValue: jest.fn(),
    } as any;

    // Create orchestrator with mock
    orchestrator = new ValueOrchestrator(mockFso);
  });

  describe('constructor', () => {
    it('should initialize with injected FormStateOrchestrator', () => {
      expect(orchestrator).toBeInstanceOf(ValueOrchestrator);
      expect(orchestrator['fso']).toBe(mockFso);
    });
  });

  describe('getValueModel', () => {
    it('should return ValueViewModel for existing field with value', () => {
      // Arrange
      const fieldId = 'testField';
      const mockValue = 'test value';
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'LABEL_TEST',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toEqual({
        fieldId: 'testField',
        value: 'test value',
        primitiveType: PRIMITIVE_TYPES.TEXT,
      });

      expect(EntryRegistry.getDefinition).toHaveBeenCalledWith('testField');
      expect(mockFso.getValue).toHaveBeenCalledWith('testField');
    });

    it('should return ValueViewModel for existing field with numeric value', () => {
      // Arrange
      const fieldId = 'counterField';
      const mockValue = 42;
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.COUNTER,
        labelToken: 'LABEL_COUNTER',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toEqual({
        fieldId: 'counterField',
        value: 42,
        primitiveType: PRIMITIVE_TYPES.COUNTER,
      });
    });

    it('should return ValueViewModel for existing field with boolean value', () => {
      // Arrange
      const fieldId = 'toggleField';
      const mockValue = true;
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TOGGLE,
        labelToken: 'LABEL_TOGGLE',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toEqual({
        fieldId: 'toggleField',
        value: true,
        primitiveType: PRIMITIVE_TYPES.TOGGLE,
      });
    });

    it('should return ValueViewModel for existing field with null value', () => {
      // Arrange
      const fieldId = 'nullableField';
      const mockValue = null;
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'LABEL_NULLABLE',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toEqual({
        fieldId: 'nullableField',
        value: null,
        primitiveType: PRIMITIVE_TYPES.TEXT,
      });
    });

    it('should return ValueViewModel for existing field with undefined value', () => {
      // Arrange
      const fieldId = 'undefinedField';
      const mockValue = undefined;
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'LABEL_UNDEFINED',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toEqual({
        fieldId: 'undefinedField',
        value: undefined,
        primitiveType: PRIMITIVE_TYPES.TEXT,
      });
    });

    it('should return null when field definition does not exist', () => {
      // Arrange
      const fieldId = 'nonExistentField';
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toBeNull();
      expect(EntryRegistry.getDefinition).toHaveBeenCalledWith('nonExistentField');
      expect(mockFso.getValue).not.toHaveBeenCalled();
    });

    it('should return null when field definition is undefined', () => {
      // Arrange
      const fieldId = 'undefinedDefinition';
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toBeNull();
      expect(EntryRegistry.getDefinition).toHaveBeenCalledWith('undefinedDefinition');
      expect(mockFso.getValue).not.toHaveBeenCalled();
    });

    it('should handle all primitive types correctly', () => {
      // Test verschillende primitive types
      const testCases = [
        { type: PRIMITIVE_TYPES.TEXT, value: 'hello' },
        { type: PRIMITIVE_TYPES.NUMBER, value: 123 },
        { type: PRIMITIVE_TYPES.CURRENCY, value: 99.99 },
        { type: PRIMITIVE_TYPES.COUNTER, value: 5 },
        { type: PRIMITIVE_TYPES.DATE, value: '2024-01-01' },
        { type: PRIMITIVE_TYPES.TOGGLE, value: false },
        { type: PRIMITIVE_TYPES.CHIP_GROUP, value: 'option1' },
        { type: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE, value: ['a', 'b'] },
        { type: PRIMITIVE_TYPES.RADIO, value: 'yes' },
        { type: PRIMITIVE_TYPES.ACTION, value: undefined },
        { type: PRIMITIVE_TYPES.LABEL, value: 'static text' },
      ];

      testCases.forEach(({ type, value }) => {
        // Reset mocks voor elke test case
        jest.clearAllMocks();

        const fieldId = `field_${type}`;
        const mockDefinition = {
          primitiveType: type,
          labelToken: `LABEL_${type}`,
        };

        (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
        mockFso.getValue.mockReturnValue(value);

        // Act
        const result = orchestrator.getValueModel(fieldId);

        // Assert
        expect(result).toEqual({
          fieldId,
          value,
          primitiveType: type,
        });
      });
    });

    it('should be pure - same input returns same output structure', () => {
      // Arrange
      const fieldId = 'pureField';
      const mockValue = 'consistent value';
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'LABEL_PURE',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result1 = orchestrator.getValueModel(fieldId);
      const result2 = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result1).toEqual(result2);
      expect(result1).toEqual({
        fieldId: 'pureField',
        value: 'consistent value',
        primitiveType: PRIMITIVE_TYPES.TEXT,
      });
    });

    it('should call fso.getValue with correct fieldId', () => {
      // Arrange
      const fieldId = 'callCheckField';
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'LABEL_CALL',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue('some value');

      // Act
      orchestrator.getValueModel(fieldId);

      // Assert
      expect(mockFso.getValue).toHaveBeenCalledTimes(1);
      expect(mockFso.getValue).toHaveBeenCalledWith('callCheckField');
    });

    it('should not call fso.getValue when definition is missing', () => {
      // Arrange
      const fieldId = 'missingField';
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      // Act
      orchestrator.getValueModel(fieldId);

      // Assert
      expect(mockFso.getValue).not.toHaveBeenCalled();
    });
  });

  describe('integration with FormStateOrchestrator', () => {
    it('should reflect changes in FormStateOrchestrator values', () => {
      // Arrange
      const fieldId = 'dynamicField';
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.COUNTER,
        labelToken: 'LABEL_DYNAMIC',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);

      // Eerste waarde
      mockFso.getValue.mockReturnValueOnce(10);
      const result1 = orchestrator.getValueModel(fieldId);
      expect(result1?.value).toBe(10);

      // Tweede waarde (veranderd)
      mockFso.getValue.mockReturnValueOnce(20);
      const result2 = orchestrator.getValueModel(fieldId);
      expect(result2?.value).toBe(20);

      // Waarden zijn verschillend
      expect(result1?.value).not.toBe(result2?.value);
    });
  });

  describe('edge cases', () => {
    it('should handle fieldId with special characters', () => {
      // Arrange
      const fieldId = 'field.with.dots-and_underscores';
      const mockValue = 'special value';
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'LABEL_SPECIAL',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toEqual({
        fieldId: 'field.with.dots-and_underscores',
        value: 'special value',
        primitiveType: PRIMITIVE_TYPES.TEXT,
      });
    });

    it('should handle empty string fieldId', () => {
      // Arrange
      const fieldId = '';
      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(null);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result).toBeNull();
      expect(EntryRegistry.getDefinition).toHaveBeenCalledWith('');
    });

    it('should handle very long fieldId', () => {
      // Arrange
      const fieldId = 'a'.repeat(1000);
      const mockValue = 'long field value';
      const mockDefinition = {
        primitiveType: PRIMITIVE_TYPES.TEXT,
        labelToken: 'LABEL_LONG',
      };

      (EntryRegistry.getDefinition as jest.Mock).mockReturnValue(mockDefinition);
      mockFso.getValue.mockReturnValue(mockValue);

      // Act
      const result = orchestrator.getValueModel(fieldId);

      // Assert
      expect(result?.fieldId).toBe(fieldId);
      expect(result?.value).toBe('long field value');
    });
  });
});