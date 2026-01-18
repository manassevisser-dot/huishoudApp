import { AuditLogger } from '@/adapters/audit/AuditLoggerAdapter'; // Check of dit pad klopt met je find-resultaat

const allocateRemainder = (total: number, parts: number): number[] => {
  const base = Math.floor(total / parts);
  const remainder = total % parts;
  return Array.from({ length: parts }, (_, i) => (i < remainder ? base + 1 : base));
};

type TransactionState = Record<string, any>;

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

    // Fix: level + msg toegevoegd voor TS2555
    AuditLogger.log('INFO', 'transaction_push', {
      type: actionType,
      pointer: this.pointer,
      adr: 'ADR-12',
    });
  }

  public undo(): TransactionState | null {
    if (this.pointer > 0) {
      this.pointer--;
      AuditLogger.log('ACTION', 'undo', { pointer: this.pointer });
      return this.history[this.pointer];
    }
    return null;
  }

  public redo(): TransactionState | null {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      AuditLogger.log('ACTION', 'redo', { pointer: this.pointer });
      return this.history[this.pointer];
    }
    return null;
  }

  public calculateDistribution(totalAmount: number, parts: number): number[] {
    return allocateRemainder(Math.floor(totalAmount), parts);
  }

  public getCurrentState(): TransactionState {
    return this.history[this.pointer];
  }
}
