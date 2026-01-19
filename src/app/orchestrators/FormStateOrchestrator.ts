import { ValueProvider } from '../../domain/interfaces/ValueProvider';
import { StateWriter } from '../../domain/interfaces/StateWriter';

/**
 * Placeholder voor de FormStateOrchestrator.
 * In Phase 2 zal deze de verbinding leggen tussen de Redux state 
 * en de domein-interfaces.
 */
export class FormStateOrchestrator implements ValueProvider, StateWriter {
  getValue(fieldId: string): unknown {
    throw new Error('Method not implemented - placeholder for P2');
  }

  updateField(fieldId: string, value: unknown): void {
    throw new Error('Method not implemented - placeholder for P2');
  }
}