// Centralized type definitions for Domain (NOT UI)
// All valid field identifiers in the application (SSOT)

// CU-F-TYPES-1: Strict minimal FieldId
// Domain blijft klein - finance bedragen via items[] in orchestrator
export type FieldId =
  // === SETUP / WIZARD ===
  | 'aantalMensen'
  | 'aantalVolwassen'
  | 'autoCount'
  | 'heeftHuisdieren'
  | 'members'
  | 'grossMonthly'
  | 'inkomstenPerLid'
  | 'car_repeater'
  | 'kinderenLabel'
  
  // === HOUSEHOLD DIRECT (schema-based) ===
  | 'huurtoeslag'
  | 'zorgtoeslag';

// Visibility engine operators
export type Operator =
  | 'eq' | 'neq'
  | 'gt' | 'gte'
  | 'lt' | 'lte'
  | 'truthy';

// Visibility condition structure
export type Condition = {
  field: FieldId;
  operator: Operator;
  value?: unknown;
  contextGuard?: (ctx?: unknown) => boolean;
};

// Domain ValueProvider contract (STRICT - internal use only)
export interface DomainValueProvider {
  getValue(fieldId: FieldId): unknown;
}

// StateWriter contract (STRICT - internal use only)
export interface StateWriter {
  updateField(fieldId: FieldId, value: unknown): void;
}