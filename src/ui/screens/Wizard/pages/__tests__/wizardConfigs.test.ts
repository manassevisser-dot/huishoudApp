import { setupHouseholdConfig } from '../1setupHousehold.config';
import { detailsHouseholdConfig } from '../2detailsHousehold.config';
import { incomeDetailsConfig } from '../3incomeDetails.config';
import { fixedExpensesConfig } from '../4fixedExpenses.config';
import { DATA_KEYS } from '@domain/constants/registry';
import { createMockState } from '@test-utils/index';
import { makeMixedHousehold } from '@test-utils/index';
import { evaluateVisibleIf } from '@utils/fieldVisibility';
const allConfigs = [
  { id: 'setup', cfg: setupHouseholdConfig },
  { id: 'details', cfg: detailsHouseholdConfig },
  { id: 'income', cfg: incomeDetailsConfig },
  { id: 'expenses', cfg: fixedExpensesConfig }
];

describe('Wizard Logic Branch Coverage', () => {
  it('moet alle conditionele logica en fallbacks in setupHouseholdConfig dekken', () => {
    const fields = setupHouseholdConfig.fields;
    const mockState = createMockState();
    
    const volwassenField = fields.find(f => f.fieldId === 'aantalVolwassen');
    const kindField = fields.find(f => f.fieldId === 'kinderenLabel');

    // --- TAK 1: Alles is undefined (test de || 0 en || 1 fallbacks) ---
    mockState.data[DATA_KEYS.SETUP] = undefined as any; 
    
    expect(evaluateVisibleIf(volwassenField?.visibleIf, mockState)).toBe(false);
    expect(volwassenField?.maxGetter?.(mockState)).toBe(1);     
    expect(kindField?.valueGetter?.(mockState)).toBe(0);      
    expect(evaluateVisibleIf(kindField?.visibleIf, mockState)).toBe(false);    

    // --- TAK 2: Gedeeltelijke data ---
    mockState.data[DATA_KEYS.SETUP] = { aantalMensen: 5, aantalVolwassen: undefined } as any;
    expect(evaluateVisibleIf(volwassenField?.visibleIf, mockState)).toBe(true);
    expect(kindField?.valueGetter?.(mockState)).toBe(5); 

    // --- TAK 3: De normale flow ---
    mockState.data[DATA_KEYS.SETUP] = { aantalMensen: 4, aantalVolwassen: 1 } as any;
    expect(kindField?.valueGetter?.(mockState)).toBe(3);
    expect(evaluateVisibleIf(kindField?.visibleIf, mockState)).toBe(true);
  });

  it('moet de filter logica in incomeDetailsConfig dekken met echte members', () => {
    const repeater = incomeDetailsConfig.fields.find(f => f.fieldId === 'member_income_repeater');
    const mockState = createMockState();
    
    mockState.data[DATA_KEYS.HOUSEHOLD] = { 
      members: makeMixedHousehold(2, 1) 
    } as any;
    
    const result = repeater?.filter?.(mockState) as Array<{
      memberType: string;
    }>;
    expect(result).toHaveLength(3);
    expect(result?.[2].memberType).toBe('child');
    

    // Test lege staat voor branch coverage op de ?? []
    mockState.data[DATA_KEYS.HOUSEHOLD] = { members: undefined } as any;
    expect(repeater?.filter?.(mockState)).toHaveLength(0);

    const section = (repeater as any).fields.find((f: any) => f.fieldId === 'member_income_details');
    expect(section.visibleIf(mockState, { memberId: '1' })).toBe(true);
    expect(section.visibleIf(mockState, {})).toBe(false);
  });

  it('moet de auto_repeater logica in fixedExpensesConfig dekken', () => {
    const autoRepeater = fixedExpensesConfig.fields.find(f => f.fieldId === 'car_repeater');
    const mockState = createMockState();

    mockState.data[DATA_KEYS.SETUP] = { autoCount: 'Een' } as any;
    expect(evaluateVisibleIf(autoRepeater?.visibleIf,mockState)).toBe(true);
  
    mockState.data[DATA_KEYS.SETUP] = { autoCount: 'Nee' } as any;
    expect(evaluateVisibleIf(autoRepeater?.visibleIf, mockState)).toBe(false);

    // Test alle countGetter branches
    mockState.data[DATA_KEYS.SETUP] = { autoCount: 'Een' } as any;
    expect(autoRepeater?.countGetter?.(mockState)).toBe(1);
    
    mockState.data[DATA_KEYS.SETUP] = { autoCount: 'Twee' } as any;
    expect(autoRepeater?.countGetter?.(mockState)).toBe(2);
    
    mockState.data[DATA_KEYS.SETUP] = { autoCount: 'Nee' } as any;
    expect(autoRepeater?.countGetter?.(mockState)).toBe(0);
  });

  it('moet basis validiteit van alle configs garanderen', () => {
    allConfigs.forEach(({ cfg }) => {
      expect(cfg.pageId).toBeDefined();
      expect(Array.isArray(cfg.fields)).toBe(true);
    });
  });
});