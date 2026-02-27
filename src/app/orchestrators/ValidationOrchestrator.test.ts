// src/app/orchestrators/ValidationOrchestrator.test.ts
/**
 * @file_intent Unit tests voor de ValidationOrchestrator – Stateless validatie-wrapper.
 * @contract Test delegatie aan ValidationManager en de validateAtBoundary logica.
 */

// Mocks moeten VOOR de imports staan
jest.mock('./managers/ValidationManager', () => ({
  ValidationManager: jest.fn().mockImplementation(() => ({
    validateFields: jest.fn().mockReturnValue({ isValid: true, errorFields: [], errors: {} }),
    validateField: jest.fn().mockImplementation((fieldId, value) => {
      if (value === undefined || value === null || value === '') return 'Dit veld is verplicht';
      return null;
    }),
    shouldValidateAtBoundary: jest.fn().mockImplementation((fieldId) => {
      return ['email', 'amountCents', 'password'].includes(fieldId);
    }),
  })),
}));

jest.mock('@domain/registry/ScreenRegistry', () => ({
  ScreenRegistry: {
    getDefinition: jest.fn().mockImplementation((screenId) => {
      if (screenId === '1setupHousehold') {
        return {
          id: '1setupHousehold',
          sectionIds: ['householdSetup'],
        };
      }
      if (screenId === 'leegSectie') {
        return {
          id: 'leegSectie',
          sectionIds: [],
        };
      }
      return null;
    }),
  },
}));

jest.mock('@domain/registry/SectionRegistry', () => ({
  SectionRegistry: {
    getDefinition: jest.fn().mockImplementation((sectionId) => {
      if (sectionId === 'householdSetup') {
        return {
          id: 'householdSetup',
          fieldIds: ['aantalMensen', 'aantalVolwassen', 'woningType'],
        };
      }
      return null;
    }),
  },
}));

jest.mock('@domain/registry/EntryRegistry', () => ({
  EntryRegistry: {
    getDefinition: jest.fn().mockImplementation((fieldId) => {
      // Derived/ACTION/LABEL worden gefilterd
      if (fieldId === 'kinderenLabel') return { isDerived: true, primitiveType: 'label' };
      if (fieldId === 'goToSettings') return { primitiveType: 'action' };
      
      // Normale velden
      return {
        primitiveType: 'text',
        isDerived: false,
      };
    }),
  },
  PRIMITIVE_TYPES: {
    ACTION: 'action',
    LABEL: 'label',
  },
}));

jest.mock('@adapters/validation/validateAtBoundary', () => ({
  validateAtBoundary: jest.fn(),
}));

import { ValidationOrchestrator } from './ValidationOrchestrator';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { ScreenRegistry } from '@domain/registry/ScreenRegistry';
import { SectionRegistry } from '@domain/registry/SectionRegistry';
import { EntryRegistry } from '@domain/registry/EntryRegistry';

const mockValidateAtBoundary = validateAtBoundary as jest.Mock;
const mockScreenGetDef = ScreenRegistry.getDefinition as jest.Mock;
const mockSectionGetDef = SectionRegistry.getDefinition as jest.Mock;
const mockEntryGetDef = EntryRegistry.getDefinition as jest.Mock;

const makeFso = () => ({
  getValue: jest.fn().mockImplementation((fieldId) => {
    if (fieldId === 'aantalMensen') return 2;
    if (fieldId === 'aantalVolwassen') return 2;
    if (fieldId === 'woningType') return 'Koop';
    return undefined;
  }),
  updateField: jest.fn(),
} as any);

const makeBusiness = () => ({
  recompute: jest.fn(),
} as any);

describe('ValidationOrchestrator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with FSO and optional BusinessManager', () => {
      const fso = makeFso();
      const orchestrator = new ValidationOrchestrator(fso);
      expect(orchestrator).toBeDefined();
    });

    it('should accept BusinessManager as second parameter', () => {
      const fso = makeFso();
      const business = makeBusiness();
      const orchestrator = new ValidationOrchestrator(fso, business);
      expect(orchestrator).toBeDefined();
    });
  });

  describe('validateSection', () => {
    it('should return isValid true when all fields are valid', () => {
      const fso = makeFso();
      const orchestrator = new ValidationOrchestrator(fso);
      
      const result = orchestrator.validateSection('1setupHousehold', {});
      
      expect(result.isValid).toBe(true);
      expect(result.errorFields).toHaveLength(0);
      expect(mockScreenGetDef).toHaveBeenCalledWith('1setupHousehold');
      expect(mockSectionGetDef).toHaveBeenCalledWith('householdSetup');
      expect(fso.getValue).toHaveBeenCalledTimes(3);
    });

    it('should return isValid true for screen without sections', () => {
      const fso = makeFso();
      const orchestrator = new ValidationOrchestrator(fso);
      
      const result = orchestrator.validateSection('leegSectie', {});
      
      expect(result.isValid).toBe(true);
      expect(mockScreenGetDef).toHaveBeenCalledWith('leegSectie');
    });

    it('should return isValid true for unknown screen', () => {
      const fso = makeFso();
      const orchestrator = new ValidationOrchestrator(fso);
      
      const result = orchestrator.validateSection('ONBEKEND', {});
      
      expect(result.isValid).toBe(true);
      expect(mockScreenGetDef).toHaveBeenCalledWith('ONBEKEND');
    });

    it('should filter out derived and action fields', () => {
      // Mock SectionRegistry met extra fields
      mockSectionGetDef.mockReturnValueOnce({
        id: 'householdSetup',
        fieldIds: ['aantalMensen', 'kinderenLabel', 'goToSettings', 'aantalVolwassen'],
      });

      const fso = makeFso();
      const orchestrator = new ValidationOrchestrator(fso);
      
      orchestrator.validateSection('1setupHousehold', {});
      
      // Alleen aantalMensen en aantalVolwassen worden gevalideerd
      expect(fso.getValue).toHaveBeenCalledWith('aantalMensen');
      expect(fso.getValue).toHaveBeenCalledWith('aantalVolwassen');
      expect(fso.getValue).not.toHaveBeenCalledWith('kinderenLabel');
      expect(fso.getValue).not.toHaveBeenCalledWith('goToSettings');
    });
  });

  describe('validateField', () => {
  it('should return error message for undefined value', () => {
    const orchestrator = new ValidationOrchestrator(makeFso());
    const result = orchestrator.validateField('aantalMensen', undefined);
    expect(result).toBe('Dit veld is verplicht');
  });

  it('should return error message for null value', () => {
    const orchestrator = new ValidationOrchestrator(makeFso());
    const result = orchestrator.validateField('aantalMensen', null);
    expect(result).toBe('Dit veld is verplicht');
  });

  it('should return error message for empty string', () => {
    const orchestrator = new ValidationOrchestrator(makeFso());
    const result = orchestrator.validateField('aantalMensen', '');
    expect(result).toBe('Dit veld is verplicht');
  });

  it('should return null for valid value', () => {
    const orchestrator = new ValidationOrchestrator(makeFso());
    const result = orchestrator.validateField('aantalMensen', 2);
    expect(result).toBeNull();
  });
  });

  describe('validateAtBoundary', () => {
  it('should validate email fields', () => {
    // ✅ Eerst de mocks klaarzetten
    const mockManager = {
      shouldValidateAtBoundary: jest.fn().mockReturnValue(true),
      validateField: jest.fn().mockReturnValue('Ongeldig e-mailadres')
    };
    
    // ✅ DAN pas de orchestrator aanmaken
    const orchestrator = new ValidationOrchestrator(makeFso());
    (orchestrator as any).manager = mockManager;
    
    // Act
    const result = orchestrator.validateAtBoundary('email', 'invalid');
    
    // Assert
    expect(result).toBe('Ongeldig e-mailadres');
    expect(mockManager.shouldValidateAtBoundary).toHaveBeenCalledWith('email');
    expect(mockManager.validateField).toHaveBeenCalledWith('email', 'invalid');
  });

  it('should validate amountCents fields', () => {
    // ✅ Eerst de mocks
    const mockManager = {
      shouldValidateAtBoundary: jest.fn().mockReturnValue(true),
      validateField: jest.fn().mockReturnValue(null)
    };
    
    // ✅ DAN orchestrator
    const orchestrator = new ValidationOrchestrator(makeFso());
    (orchestrator as any).manager = mockManager;
    
    const result = orchestrator.validateAtBoundary('amountCents', 1000);
    
    expect(result).toBeNull();
  });
});

describe('updateAndValidate', () => {
  it('should update field when validation succeeds', () => {
    mockValidateAtBoundary.mockReturnValueOnce({ success: true, data: 42, error: null });
    
    const fso = makeFso();
    const business = makeBusiness();
    const orchestrator = new ValidationOrchestrator(fso, business);
    
    orchestrator.updateAndValidate('aantalMensen', 42);
    
    expect(mockValidateAtBoundary).toHaveBeenCalledWith('aantalMensen', 42);
    expect(fso.updateField).toHaveBeenCalledWith('aantalMensen', 42);
    expect(business.recompute).toHaveBeenCalledWith(fso);
  });

  it('should not update field when validation fails', () => {
    mockValidateAtBoundary.mockReturnValueOnce({ success: false, error: 'Ongeldige waarde' });
    
    const fso = makeFso();
    const business = makeBusiness();
    const orchestrator = new ValidationOrchestrator(fso, business);
    
    orchestrator.updateAndValidate('aantalMensen', -1);
    
    expect(fso.updateField).not.toHaveBeenCalled();
    expect(business.recompute).not.toHaveBeenCalled();
  });
});

  describe('resolveValidatableFieldIds', () => {
    it('should return empty array for unknown screen', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      // @ts-ignore - testen van private methode
      const result = orchestrator.resolveValidatableFieldIds('ONBEKEND');
      expect(result).toEqual([]);
    });

    it('should filter out derived and action fields', () => {
      mockSectionGetDef.mockReturnValueOnce({
        id: 'householdSetup',
        fieldIds: ['aantalMensen', 'kinderenLabel', 'goToSettings', 'aantalVolwassen'],
      });

      const orchestrator = new ValidationOrchestrator(makeFso());
      // @ts-ignore - testen van private methode
      const result = orchestrator.resolveValidatableFieldIds('1setupHousehold');
      
      expect(result).toEqual(['aantalMensen', 'aantalVolwassen']);
    });
  });
});