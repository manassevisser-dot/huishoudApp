// src/app/orchestrators/UIManager.test.ts

import { UIManager } from './UIManager';
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import { VisibilityOrchestrator } from '@app/orchestrators/VisibilityOrchestrator';
import { RenderOrchestrator } from '@app/orchestrators/RenderOrchestrator';
import { PrimitiveOrchestrator } from '@app/orchestrators/PrimitiveOrchestrator';

jest.mock('@app/orchestrators/FormStateOrchestrator');
jest.mock('@app/orchestrators/VisibilityOrchestrator');
jest.mock('@app/orchestrators/RenderOrchestrator');
jest.mock('@app/orchestrators/PrimitiveOrchestrator');

// Hulpvariabele om buildFieldViewModel te kunnen configureren per test
let renderBuildFieldViewModelMock: jest.Mock;

describe('UIManager', () => {
  const mockUpdateField = jest.fn();
  let mockFso: jest.Mocked<FormStateOrchestrator>;
  let mockVisibility: jest.Mocked<VisibilityOrchestrator>;

  beforeEach(() => {
    const mockGetState = jest.fn().mockReturnValue({
      schemaVersion: '1.0',
      activeStep: 'LANDING',
      currentScreenId: 'screen_1',
      isValid: true,
      data: {
        setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Geen', woningType: 'Koop' },
        household: { members: [] },
        finance: { income: { items: [] }, expenses: { items: [] } },
      },
      meta: { lastModified: new Date().toISOString(), version: 1 },
      viewModels: {},
    });

    const mockDispatch = jest.fn();

    mockFso = new FormStateOrchestrator(mockGetState, mockDispatch) as jest.Mocked<FormStateOrchestrator>;
    mockVisibility = new VisibilityOrchestrator(mockFso) as jest.Mocked<VisibilityOrchestrator>;

    jest.clearAllMocks();

    // Reset de mock-functie
    renderBuildFieldViewModelMock = jest.fn();
    (RenderOrchestrator as jest.Mock).mockImplementation(() => ({
      buildFieldViewModel: renderBuildFieldViewModelMock,
    }));

    mockVisibility.evaluate.mockReturnValue(true);

    (PrimitiveOrchestrator as jest.Mock).mockImplementation(() => ({
      buildPrimitiveViewModel: jest.fn().mockImplementation((entryVm) => ({
        ...entryVm,
        sectionType: 'InputField',
        props: { value: entryVm.value },
      })),
    }));
  });

  describe('constructor', () => {
    it('initialiseert zonder PrimitiveOrchestrator als updateField ontbreekt', () => {
      const manager = new UIManager(mockFso, mockVisibility);
      expect(manager).toBeDefined();
    });

    it('initialiseert mét PrimitiveOrchestrator als updateField is meegegeven', () => {
      const manager = new UIManager(mockFso, mockVisibility, mockUpdateField);
      expect(manager).toBeDefined();
      expect(PrimitiveOrchestrator).toHaveBeenCalledWith(mockUpdateField);
    });
  });

  describe('buildFieldViewModel', () => {
    it('retourneert null voor lege of ongeldige fieldId', () => {
      const manager = new UIManager(mockFso, mockVisibility);
      expect(manager.buildFieldViewModel('')).toBeNull();
      expect(manager.buildFieldViewModel(null as any)).toBeNull();
      expect(manager.buildFieldViewModel(undefined as any)).toBeNull();
    });

    it('roept RenderOrchestrator aan en retourneert het veld als zichtbaar', () => {
      renderBuildFieldViewModelMock.mockReturnValue({
        fieldId: 'income',
        labelToken: 'label.income',
        visibilityRuleName: null,
        fieldType: 'text',
        value: '',
      });

      const manager = new UIManager(mockFso, mockVisibility);
      const result = manager.buildFieldViewModel('income');

      expect(result).toEqual({
        fieldId: 'income',
        labelToken: 'label.income',
        visibilityRuleName: null,
        fieldType: 'text',
        value: '',
      });
    });

    it('retourneert null als visibility rule faalt', () => {
      renderBuildFieldViewModelMock.mockReturnValue({
        fieldId: 'aowEligible',
        visibilityRuleName: 'isAowAge',
        fieldType: 'toggle',
        value: false,
        labelToken: 'label.aowEligible',
      });

      mockVisibility.evaluate.mockReturnValue(false);

      const manager = new UIManager(mockFso, mockVisibility);
      const result = manager.buildFieldViewModel('aowEligible', { memberId: 'm1' });

      expect(mockVisibility.evaluate).toHaveBeenCalledWith('isAowAge', 'm1');
      expect(result).toBeNull();
    });
  });

  describe('buildFieldViewModels', () => {
    it('filtreert null-resultaten en retourneert alleen geldige VMs', () => {
      renderBuildFieldViewModelMock.mockImplementation((fieldId: string) => {
        if (fieldId === 'hiddenField') {
          return {
            fieldId: 'hiddenField',
            visibilityRuleName: 'alwaysFalse',
            fieldType: 'text',
            value: '',
            labelToken: 'label.hiddenField',
          };
        }
        return {
          fieldId,
          visibilityRuleName: null,
          fieldType: 'text',
          value: '',
          labelToken: `label.${fieldId}`,
        };
      });

      mockVisibility.evaluate.mockImplementation((rule: string) => rule !== 'alwaysFalse');

      const manager = new UIManager(mockFso, mockVisibility);
      const results = manager.buildFieldViewModels(['visibleField', 'hiddenField']);

      expect(results).toHaveLength(1);
      expect(results[0].fieldId).toBe('visibleField');
    });

    it('retourneert lege array bij lege input', () => {
      const manager = new UIManager(mockFso, mockVisibility);
      expect(manager.buildFieldViewModels([])).toEqual([]);
      expect(manager.buildFieldViewModels(null as any)).toEqual([]);
    });
  });

  describe('buildScreenViewModel', () => {
    it('bouwt ScreenViewModel op basis van ScreenConfig', () => {
      renderBuildFieldViewModelMock.mockImplementation((fieldId: string) => ({
        fieldId,
        labelToken: `label.${fieldId}`,
        visibilityRuleName: null,
        fieldType: 'text',
        value: '',
      }));

      const screenConfig = {
        screenId: 'finance-screen',
        titleToken: 'screens.finance.title',
        fields: [{ fieldId: 'income' }, { fieldId: 'expenses' }],
      };

      const manager = new UIManager(mockFso, mockVisibility);
      const result = manager.buildScreenViewModel(screenConfig);

      expect(result).toEqual({
        screenId: 'finance-screen',
        titleToken: 'screens.finance.title',
        fields: [
          { fieldId: 'income', labelToken: 'label.income', visibilityRuleName: null, fieldType: 'text', value: '' },
          { fieldId: 'expenses', labelToken: 'label.expenses', visibilityRuleName: null, fieldType: 'text', value: '' },
        ],
      });
    });
  });

  describe('buildScreenPrimitiveViewModels', () => {
    it('retourneert lege array als PrimitiveOrchestrator niet beschikbaar is', () => {
      const manager = new UIManager(mockFso, mockVisibility);
      const result = manager.buildScreenPrimitiveViewModels(['income']);
      expect(result).toEqual([]);
    });

    it('transformeert FieldViewModels naar PrimitiveViewModels', () => {
      renderBuildFieldViewModelMock.mockReturnValue({
        fieldId: 'income',
        labelToken: 'label.income',
        visibilityRuleName: null,
        fieldType: 'text',
        value: '100',
      });

      const manager = new UIManager(mockFso, mockVisibility, mockUpdateField);
      const result = manager.buildScreenPrimitiveViewModels(['income']);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        fieldId: 'income',
        sectionType: 'InputField',
        props: { value: '100' },
      });
    });
  });
});