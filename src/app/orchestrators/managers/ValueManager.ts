// src/app/orchestrators/managers/ValueManager.ts
import { IValueOrchestrator, ValueViewModel } from '../interfaces/IValueOrchestrator';

// src/app/orchestrators/managers/ValueManager.ts
export class ValueManager implements IValueOrchestrator { // Voeg de 'implements' toe
  constructor(private readonly orchestrator: IValueOrchestrator) {}

  // Deze methode MOET er zijn voor de Master
  public getValueModel(fieldId: string): ValueViewModel | null {
    return this.orchestrator.getValueModel(fieldId);
  }

  // Jouw extra 'bulk' methode
  public getSnapshot(fieldIds: string[]): ValueViewModel[] {
  return fieldIds
    .map(id => this.getValueModel(id))
    .filter((vm): vm is ValueViewModel => vm !== null && vm !== undefined);  // ← Filter ook undefined
}
}