import { StateWriter, FieldId } from '@domain/core';
import { ValueProvider } from '@domain/interfaces/ValueProvider';
import type { FormState } from '@shared-types/form';
import type { Member } from '@domain/types';
import { ImportOrchestrator } from './ImportOrchestrator';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

// Constants
const PATH_DEPTH_SETUP = 3;
const PATH_DEPTH_HOUSEHOLD = 3;

// Path mapping voor fieldId → state path
const FIELD_PATHS: Partial<Record<FieldId, string>> = {
  aantalMensen: 'data.setup.aantalMensen',
  aantalVolwassen: 'data.setup.aantalVolwassen',
  autoCount: 'data.setup.autoCount',
  heeftHuisdieren: 'data.setup.heeftHuisdieren',
  members: 'data.household.members',
  car_repeater: 'data.setup.car_repeater',
  kinderenLabel: 'data.setup.kinderenLabel',
  huurtoeslag: 'data.household.huurtoeslag',
  zorgtoeslag: 'data.household.zorgtoeslag',
  grossMonthly: 'data.household.finance.income.grossMonthly',
  inkomstenPerLid: 'data.household.finance.income.inkomstenPerLid',
};

/**
 * Helper: Update setup section
 */
function updateSetupPath(state: FormState, key: string, value: unknown): FormState {
  const setupKey = key as keyof typeof state.data.setup;
  return {
    ...state,
    data: {
      ...state.data,
      setup: {
        ...state.data.setup,
        [setupKey]: value
      }
    }
  };
}

/**
 * Helper: Update household section
 */
function updateHouseholdPath(state: FormState, key: string, value: unknown): FormState {
  const householdKey = key as keyof typeof state.data.household;
  return {
    ...state,
    data: {
      ...state.data,
      household: {
        ...state.data.household,
        [householdKey]: value as Member[]
      }
    }
  };
}

/**
 * Helper: Update finance income section
 */
function updateFinanceIncomePath(state: FormState, key: string, value: unknown): FormState {
  const incomeKey = key as keyof typeof state.data.finance.income;
  
  return {
    ...state,
    data: {
      ...state.data,
      // Finance staat NAAST household, niet erin
      finance: {
        ...state.data.finance,
        income: {
          ...state.data.finance.income,
          [incomeKey]: value
        }
      },
      // We behouden household zoals hij was, zonder de per ongeluk toegevoegde finance nest
      household: {
        ...state.data.household
      }
    }
  };
}

/**
 * Helper: Update finance expenses section
 */
function updateFinanceExpensesPath(state: FormState, key: string, value: unknown): FormState {
  // De key referentie moet nu ook naar het juiste (platte) pad kijken
  const expensesKey = key as keyof typeof state.data.finance.expenses;
  
  return {
    ...state,
    data: {
      ...state.data,
      // Finance staat nu op top-level binnen data
      finance: {
        ...state.data.finance,
        expenses: {
          ...state.data.finance.expenses,
          [expensesKey]: value
        }
      },
      // Household blijft behouden maar zonder de (foutieve) finance nesting
      household: {
        ...state.data.household
      }
    }
  };
}

/**
 * Helper: Route finance section updates
 */
function updateFinancePath(state: FormState, keys: string[], value: unknown): FormState | null {
  // Adjusted for data.household.finance path
  if (keys[3] === 'income') {
    return updateFinanceIncomePath(state, keys[4], value);
  }
  if (keys[3] === 'expenses') {
    return updateFinanceExpensesPath(state, keys[4], value);
  }
  return null;
}

/**
 * Generic immutable path update (type-safe, no 'any')
 * Complexity reduced by extracting section-specific helpers
 */
function updatePath(state: FormState, path: string, value: unknown): FormState {
  const keys = path.split('.');
  
  // Setup section
  if (keys.length === PATH_DEPTH_SETUP && keys[0] === 'data' && keys[1] === 'setup') {
    return updateSetupPath(state, keys[2], value);
  }
  
  // Household section (non-finance)
  if (keys.length === PATH_DEPTH_HOUSEHOLD && keys[0] === 'data' && keys[1] === 'household') {
    return updateHouseholdPath(state, keys[2], value);
  }
  
  // Finance sections (under household)
  if (keys[0] === 'data' && keys[1] === 'household' && keys[2] === 'finance') {
    const result = updateFinancePath(state, keys, value);
    if (result !== null) return result;
  }
  
  return state; // fail-closed
}

// Helper: veilige nested property access
function resolveFieldPath(fieldId: FieldId, state: FormState): unknown {
  const path = FIELD_PATHS[fieldId];
  if (path === undefined) {
    return undefined;
  }
  
  const keys = path.split('.');
  let result: unknown = state;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return undefined;
    }
    result = (result as Record<string, unknown>)[key];
  }
  
  return result;
}

// Action types voor FSM
type FormAction = 
  | { type: 'FIELD_CHANGED'; fieldId: FieldId; value: unknown };

// Pure reducer (ADR-14) - GENERIC, geen field-specifieke logica
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'FIELD_CHANGED': {
      const { fieldId, value } = action;
      const path = FIELD_PATHS[fieldId];
      
      if (path === undefined) {
        return state; // fail-closed
      }
      
      return updatePath(state, path, value);
    }
    default:
      return state;
  }
}

// Type guard
function isMemberArray(value: unknown): value is Member[] {
  if (!Array.isArray(value)) {
    return false;
  }
  if (value.length > 0) {
    const first: unknown = value[0];
    return (
      typeof first === 'object' &&
      first !== null &&
      'entityId' in first &&
      'fieldId' in first
    );
  }
  return true;
}

export class FormStateOrchestrator implements ValueProvider, StateWriter {
  private state: FormState;
  private importOrchestrator: ImportOrchestrator;

  constructor(initialState: FormState, importOrchestrator?: ImportOrchestrator) {
    this.state = initialState;
    this.importOrchestrator = importOrchestrator !== null && importOrchestrator !== undefined
      ? importOrchestrator
      : new ImportOrchestrator();
  }

  /**
   * CU-F-LOOKUP: Read income item amount by fieldId
   * Finance bedragen via generieke items[] lookup
   */
  
  
  private readIncomeItemAmount(rawId: string): unknown {
    // Direct naar data.finance, niet via household
    const items = this.state.data.finance?.income?.items;
  
    if (!Array.isArray(items)) {
      return undefined;
    }
    return items.find((i) => i.fieldId === rawId)?.amount;
  }

  /**
   * CU-F-LOOKUP: Read expense item amount by fieldId
   * Finance bedragen via generieke items[] lookup
   */
  private readExpenseItemAmount(rawId: string): unknown {
    // Direct naar data.finance, niet via household
    const items = this.state.data.finance?.expenses?.items;
    
    if (!Array.isArray(items)) {
      return undefined;
    }
    return items.find((i) => i.fieldId === rawId)?.amount;
  }

  /**
   * Helper: Check if fieldId is a strict domain FieldId
   */
  private isStrictFieldId(fieldId: string): fieldId is FieldId {
    return FIELD_PATHS[fieldId as FieldId] !== undefined;
  }

  // FSM dispatcher (ADR-08: ONLY mutation point)
  private dispatch(action: FormAction): void {
    this.state = formReducer(this.state, action);
  }

  /**
   * CU-F-LOOKUP: Uitgebreide getValue met items lookup
   * Routing: household direct → finance items → setup/wizard strict domain
   * 
   * @param fieldId - FieldId (strict) or string (dynamic finance keys)
   * @returns Field value or undefined
   */
  getValue(fieldId: FieldId | string): unknown {
    // 1) Household direct (schema-based, strict domain)
    if (fieldId === 'huurtoeslag') {
      return this.state.data.household?.huurtoeslag;
    }
    if (fieldId === 'zorgtoeslag') {
      return this.state.data.household?.zorgtoeslag;
    }
    
    // 2) Dynamic finance items (generieke lookup)
    // Check income items
    const incomeAmount = this.readIncomeItemAmount(fieldId as string);
    if (incomeAmount !== undefined) {
      return incomeAmount;
    }
    
    // Check expense items
    const expenseAmount = this.readExpenseItemAmount(fieldId as string);
    if (expenseAmount !== undefined) {
      return expenseAmount;
    }
    
    // 3) Setup / Wizard / Fallback (strict domain via existing logic)
    // Only for strict FieldId types
    if (this.isStrictFieldId(fieldId)) {
      return resolveFieldPath(fieldId, this.state);
    }
    
    // Unknown key - fail closed
    return undefined;
  }

  // StateWriter implementation - FACADE to dispatch (niet direct muteren!)
  updateField(fieldId: FieldId, value: unknown): void {
    this.dispatch({ type: 'FIELD_CHANGED', fieldId, value });
  }

  /**
   * P3 Adapter Integration: Validates field input via adapter boundary
   * 
   * ADR-01 Enforcement: Orchestrator uses ONLY adapter for validation, not domain directly
   * 
   * @param fieldId - Field identifier
   * @param value - Raw input value from UI
   * @returns Error message string if invalid, null if valid
   * 
   * @example
   * const error = orchestrator.validate('aantalMensen', '5');
   * if (error) {
   *   showError(error); // "Waarde moet minimaal 1 zijn"
   * }
   */
  public validate(fieldId: string, value: unknown): string | null {
    // Route through adapter boundary (NOT domain directly!)
    const result = validateAtBoundary(fieldId, value);
    
    if (!result.success) {
      return result.error;
    }
    
    // Validation passed
    return null;
  }

  async importCsvData(csvText: string): Promise<unknown> {
    const membersValue = this.getValue('members');
    const members = isMemberArray(membersValue) ? membersValue : [];

    const setupData = {
      aantalMensen: this.getValue('aantalMensen'),
      aantalVolwassen: this.getValue('aantalVolwassen'),
      autoCount: this.getValue('autoCount'),
      heeftHuisdieren: this.getValue('heeftHuisdieren'),
    };

    return this.importOrchestrator.processCsvImport({
      csvText,
      members,
      setupData
    });
  }
}