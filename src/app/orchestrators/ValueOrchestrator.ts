// src/app/orchestrators/ValueOrchestrator.ts
import { FormStateOrchestrator } from './FormStateOrchestrator';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { PrimitiveType } from '@domain/registry/PrimitiveRegistry';
import { IValueOrchestrator, ValueViewModel } from './interfaces/IValueOrchestrator';

export class ValueOrchestrator implements IValueOrchestrator {
  constructor(private readonly fso: FormStateOrchestrator) {}
  public getValueModel(fieldId: string): ValueViewModel | null {
    const definition = EntryRegistry.getDefinition(fieldId);
    if (definition === null || definition === undefined) {
      return null;
    }
    return {
      fieldId,
      value: this.fso.getValue(fieldId),
      primitiveType: definition.primitiveType as PrimitiveType,
    };
  }
}