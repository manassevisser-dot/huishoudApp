// src/adapters/transaction/stateful.ts
import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter';


const allocateRemainder = (total: number, parts: number): number[] => {
  const base = Math.floor(total / parts);
  const remainder = total % parts;
  return Array.from({ length: parts }, (_, i) => (i < remainder ? base + 1 : base));
};

// FIX: Vervang 'any' door 'Record<string, unknown>' 
// Dit is de veilige versie van een object in TypeScript
type TransactionState = Record<string, unknown>;

export class StatefulTransactionAdapter {
  private history: TransactionState[] = [];
  private pointer: number = -1;
  private readonly VERSION = '2025-01-A';

  constructor(initialState: TransactionState) {
    this.push(initialState, 'INIT');
  }

  public push(newState: TransactionState, actionType: string): void {
    if (this.pointer < this.history.length - 1) {
      this.history = this.history.slice(0, this.pointer + 1);
    }

    this.history.push(newState);
    this.pointer++;

    // FIX: AuditLogger aanpassen aan de verwachte 1-2 argumenten
    // Waarschijnlijk verwacht hij één object met alle data, of (level, object)
    AuditLogger.log('INFO', {
      event: 'transaction_push',
      type: actionType,
      pointer: this.pointer,
      adr: 'ADR-12',
      version: this.VERSION
    });
  }

  public undo(): TransactionState | null {
    if (this.pointer > 0) {
      this.pointer--;
      AuditLogger.log('ACTION', { event: 'undo', pointer: this.pointer });
      
      const state = this.history[this.pointer];
      return state !== undefined ? state : null;
    }
    return null;
  }

  public redo(): TransactionState | null {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      AuditLogger.log('ACTION', { event: 'redo', pointer: this.pointer });
      
      const state = this.history[this.pointer];
      return state !== undefined ? state : null;
    }
    return null;
  }

  public calculateDistribution(totalAmount: number, parts: number): number[] {
    return allocateRemainder(Math.floor(totalAmount), parts);
  }

  public getCurrentState(): TransactionState | undefined {
    return this.history[this.pointer];
  }
}