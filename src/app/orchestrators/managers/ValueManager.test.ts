// src/app/orchestrators/managers/ValueManager.test.ts
import { ValueManager } from './ValueManager';
import { IValueOrchestrator, ValueViewModel } from '../interfaces/IValueOrchestrator';
import { PRIMITIVE_TYPES } from '@domain/registry/PrimitiveRegistry';

// Mock orchestrator
const createMockOrchestrator = (): jest.Mocked<IValueOrchestrator> => ({
  getValueModel: jest.fn(),
});

describe('ValueManager', () => {
  let mockOrchestrator: jest.Mocked<IValueOrchestrator>;
  let valueManager: ValueManager;

  beforeEach(() => {
    mockOrchestrator = createMockOrchestrator();
    valueManager = new ValueManager(mockOrchestrator);
  });

  describe('constructor', () => {
    it('should initialize with injected orchestrator', () => {
      expect(valueManager).toBeInstanceOf(ValueManager);
      expect(valueManager['orchestrator']).toBe(mockOrchestrator);
    });
  });

  describe('getValueModel', () => {
    it('should delegate to orchestrator.getValueModel for single field', () => {
      // Arrange
      const fieldId = 'testField';
      const mockViewModel: ValueViewModel = {
        fieldId: 'testField',
        value: 'test value',
        primitiveType: PRIMITIVE_TYPES.TEXT,
      };
      
      mockOrchestrator.getValueModel.mockReturnValueOnce(mockViewModel);

      // Act
      const result = valueManager.getValueModel(fieldId);

      // Assert
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledTimes(1);
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledWith('testField');
      expect(result).toBe(mockViewModel);
    });

    it('should return null when orchestrator returns null', () => {
      // Arrange
      const fieldId = 'nonExistentField';
      mockOrchestrator.getValueModel.mockReturnValueOnce(null);

      // Act
      const result = valueManager.getValueModel(fieldId);

      // Assert
      expect(result).toBeNull();
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledWith('nonExistentField');
    });

    it('should handle undefined from orchestrator', () => {
      // Arrange
      const fieldId = 'undefinedField';
      mockOrchestrator.getValueModel.mockReturnValueOnce(undefined as any);

      // Act
      const result = valueManager.getValueModel(fieldId);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should pass through any primitive type from orchestrator', () => {
      // Arrange
      const testCases: ValueViewModel[] = [
        { fieldId: 'text', value: 'hello', primitiveType: PRIMITIVE_TYPES.TEXT },
        { fieldId: 'number', value: 42, primitiveType: PRIMITIVE_TYPES.NUMBER },
        { fieldId: 'currency', value: 99.99, primitiveType: PRIMITIVE_TYPES.CURRENCY },
        { fieldId: 'counter', value: 5, primitiveType: PRIMITIVE_TYPES.COUNTER },
        { fieldId: 'date', value: '2024-01-01', primitiveType: PRIMITIVE_TYPES.DATE },
        { fieldId: 'toggle', value: true, primitiveType: PRIMITIVE_TYPES.TOGGLE },
        { fieldId: 'chip', value: 'option1', primitiveType: PRIMITIVE_TYPES.CHIP_GROUP },
        { fieldId: 'chipMulti', value: ['a', 'b'], primitiveType: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE },
        { fieldId: 'radio', value: 'yes', primitiveType: PRIMITIVE_TYPES.RADIO },
        { fieldId: 'action', value: undefined, primitiveType: PRIMITIVE_TYPES.ACTION },
        { fieldId: 'label', value: 'static', primitiveType: PRIMITIVE_TYPES.LABEL },
      ];

      testCases.forEach(mockViewModel => {
        mockOrchestrator.getValueModel.mockReturnValueOnce(mockViewModel);
        
        const result = valueManager.getValueModel(mockViewModel.fieldId);
        
        expect(result).toEqual(mockViewModel);
      });
    });
  });

  describe('getSnapshot', () => {
    it('should return array of view models for multiple fieldIds', () => {
      // Arrange
      const fieldIds = ['field1', 'field2', 'field3'];
      const mockViewModels: ValueViewModel[] = [
        { fieldId: 'field1', value: 'value1', primitiveType: PRIMITIVE_TYPES.TEXT },
        { fieldId: 'field2', value: 42, primitiveType: PRIMITIVE_TYPES.NUMBER },
        { fieldId: 'field3', value: true, primitiveType: PRIMITIVE_TYPES.TOGGLE },
      ];

      mockOrchestrator.getValueModel
        .mockReturnValueOnce(mockViewModels[0])
        .mockReturnValueOnce(mockViewModels[1])
        .mockReturnValueOnce(mockViewModels[2]);

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockViewModels);
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledTimes(3);
      expect(mockOrchestrator.getValueModel).toHaveBeenNthCalledWith(1, 'field1');
      expect(mockOrchestrator.getValueModel).toHaveBeenNthCalledWith(2, 'field2');
      expect(mockOrchestrator.getValueModel).toHaveBeenNthCalledWith(3, 'field3');
    });

    it('should filter out null values from snapshot', () => {
      // Arrange
      const fieldIds = ['field1', 'field2', 'field3'];
      
      mockOrchestrator.getValueModel
        .mockReturnValueOnce({ fieldId: 'field1', value: 'value1', primitiveType: PRIMITIVE_TYPES.TEXT })
        .mockReturnValueOnce(null)
        .mockReturnValueOnce({ fieldId: 'field3', value: 99, primitiveType: PRIMITIVE_TYPES.NUMBER });

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { fieldId: 'field1', value: 'value1', primitiveType: PRIMITIVE_TYPES.TEXT },
        { fieldId: 'field3', value: 99, primitiveType: PRIMITIVE_TYPES.NUMBER },
      ]);
    });

    it('should filter out undefined values from snapshot', () => {
      // Arrange
      const fieldIds = ['field1', 'field2'];
      
      mockOrchestrator.getValueModel
        .mockReturnValueOnce({ fieldId: 'field1', value: 'value1', primitiveType: PRIMITIVE_TYPES.TEXT })
        .mockReturnValueOnce(undefined as any);

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result).toHaveLength(1);
      expect(result).toEqual([
        { fieldId: 'field1', value: 'value1', primitiveType: PRIMITIVE_TYPES.TEXT },
      ]);
    });

    it('should return empty array when all fields return null', () => {
      // Arrange
      const fieldIds = ['field1', 'field2', 'field3'];
      
      mockOrchestrator.getValueModel
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null);

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result).toEqual([]);
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledTimes(3);
    });

    it('should handle empty fieldIds array', () => {
      // Arrange
      const fieldIds: string[] = [];

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result).toEqual([]);
      expect(mockOrchestrator.getValueModel).not.toHaveBeenCalled();
    });

    it('should preserve order of fieldIds in snapshot', () => {
      // Arrange
      const fieldIds = ['fieldA', 'fieldB', 'fieldC'];
      const mockViewModels = {
        fieldA: { fieldId: 'fieldA', value: 'A', primitiveType: PRIMITIVE_TYPES.TEXT },
        fieldB: { fieldId: 'fieldB', value: 'B', primitiveType: PRIMITIVE_TYPES.TEXT },
        fieldC: { fieldId: 'fieldC', value: 'C', primitiveType: PRIMITIVE_TYPES.TEXT },
      };

      mockOrchestrator.getValueModel
        .mockReturnValueOnce(mockViewModels.fieldA)
        .mockReturnValueOnce(mockViewModels.fieldB)
        .mockReturnValueOnce(mockViewModels.fieldC);

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result.map(vm => vm.fieldId)).toEqual(['fieldA', 'fieldB', 'fieldC']);
    });

    it('should handle duplicate fieldIds', () => {
      // Arrange
      const fieldIds = ['field1', 'field1', 'field2'];
      const mockViewModel1 = { fieldId: 'field1', value: 'value1', primitiveType: PRIMITIVE_TYPES.TEXT };
      const mockViewModel2 = { fieldId: 'field2', value: 'value2', primitiveType: PRIMITIVE_TYPES.TEXT };

      mockOrchestrator.getValueModel
        .mockReturnValueOnce(mockViewModel1)
        .mockReturnValueOnce(mockViewModel1)  // Zelfde field1 nog een keer
        .mockReturnValueOnce(mockViewModel2);

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(mockViewModel1);
      expect(result[1]).toBe(mockViewModel1);
      expect(result[2]).toBe(mockViewModel2);
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from orchestrator in getValueModel', () => {
      // Arrange
      const fieldId = 'errorField';
      const error = new Error('Orchestrator error');
      mockOrchestrator.getValueModel.mockImplementationOnce(() => {
        throw error;
      });

      // Act & Assert
      expect(() => valueManager.getValueModel(fieldId)).toThrow('Orchestrator error');
    });

    it('should propagate errors from orchestrator in getSnapshot', () => {
      // Arrange
      const fieldIds = ['field1', 'field2', 'field3'];
      const error = new Error('Orchestrator error');
      
      mockOrchestrator.getValueModel
        .mockReturnValueOnce({ fieldId: 'field1', value: 'ok', primitiveType: PRIMITIVE_TYPES.TEXT })
        .mockImplementationOnce(() => { throw error; });

      // Act & Assert
      expect(() => valueManager.getSnapshot(fieldIds)).toThrow('Orchestrator error');
      
      // Eerste call was ok, tweede call gooit error
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledTimes(2);
    });

    it('should handle non-Error throws gracefully', () => {
      // Arrange
      const fieldId = 'badField';
      mockOrchestrator.getValueModel.mockImplementationOnce(() => {
        throw 'string error';  // Geen Error object
      });

      // Act & Assert
      expect(() => valueManager.getValueModel(fieldId)).toThrow();
    });
  });

  describe('type safety', () => {
    it('should maintain correct types in filtered snapshot', () => {
      // Arrange
      const fieldIds = ['textField', 'numberField', 'invalidField'];
      
      mockOrchestrator.getValueModel
        .mockReturnValueOnce({ fieldId: 'textField', value: 'hello', primitiveType: PRIMITIVE_TYPES.TEXT })
        .mockReturnValueOnce({ fieldId: 'numberField', value: 123, primitiveType: PRIMITIVE_TYPES.NUMBER })
        .mockReturnValueOnce(null);

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // TypeScript zou dit moeten accepteren (result is ValueViewModel[])
      const textVm = result.find(vm => vm.fieldId === 'textField');
      const numberVm = result.find(vm => vm.fieldId === 'numberField');

      expect(textVm?.value).toBe('hello');
      expect(numberVm?.value).toBe(123);
      expect(result).toHaveLength(2);
    });
  });

  describe('performance characteristics', () => {
    it('should handle large number of fieldIds efficiently', () => {
      // Arrange
      const fieldIds = Array.from({ length: 1000 }, (_, i) => `field${i}`);
      
      // Mock alle 1000 calls
      fieldIds.forEach((id, index) => {
        mockOrchestrator.getValueModel.mockReturnValueOnce({
          fieldId: id,
          value: `value${index}`,
          primitiveType: PRIMITIVE_TYPES.TEXT,
        });
      });

      // Act
      const startTime = Date.now();
      const result = valueManager.getSnapshot(fieldIds);
      const endTime = Date.now();

      // Assert
      expect(result).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Zou snel moeten zijn (<100ms)
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledTimes(1000);
    });

    it('should handle mixed null/valid values in large array', () => {
      // Arrange
      const fieldIds = Array.from({ length: 500 }, (_, i) => `field${i}`);
      
      // Om en om: valid, null, valid, null, ...
      fieldIds.forEach((id, index) => {
        if (index % 2 === 0) {
          mockOrchestrator.getValueModel.mockReturnValueOnce({
            fieldId: id,
            value: `value${index}`,
            primitiveType: PRIMITIVE_TYPES.TEXT,
          });
        } else {
          mockOrchestrator.getValueModel.mockReturnValueOnce(null);
        }
      });

      // Act
      const result = valueManager.getSnapshot(fieldIds);

      // Assert
      expect(result).toHaveLength(250); // Alleen de even indices
      expect(mockOrchestrator.getValueModel).toHaveBeenCalledTimes(500);
    });
  });
});