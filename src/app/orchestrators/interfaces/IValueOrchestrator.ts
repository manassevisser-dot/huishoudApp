// src/app/orchestrators/interfaces/IValueOrchestrator.ts
import { PrimitiveType } from '@domain/registry/PrimitiveRegistry';

export interface ValueViewModel {
  fieldId: string;
  value: unknown;
  primitiveType: PrimitiveType;
  options?: readonly string[];
}

export interface IValueOrchestrator {
  getValueModel(fieldId: string): ValueViewModel | null;
}