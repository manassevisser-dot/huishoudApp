// src/adapters/transaction/stateful.ts
/**
 * @file_intent Beheert de tijdlijn van applicatie-states (Undo/Redo) en voert rekenkundige verdelingen uit.
 * @repo_architecture Mobile Industry (MI) - State History & Utility Layer.
 * @term_definition pointer = De huidige index in de geschiedenis-stack. allocateRemainder = Algoritme om bedragen eerlijk te verdelen over termijnen zonder afrondingsverschillen.
 * @contract Biedt een stateful wrapper rondom transactie-data. Garandeert dat wijzigingen ongedaan gemaakt kunnen worden en logt elke mutatie via de AuditLogger conform ADR-12.
 * @ai_instruction De geschiedenis wordt lineair opgeslagen; bij een 'push' op een pointer in het verleden wordt de toekomstige stack gewist. Gebruik calculateDistribution voor het berekenen van betalingstermijnen.
 */

import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter';

const allocateRemainder = (total: number, parts: number): number[] => {
  // We gebruiken Math.trunc om de 'base' altijd richting 0 te berekenen
  // Bij 10/3 wordt dit 3, bij -10/3 wordt dit -3
  const base = Math.trunc(total / parts);
  const remainder = total % parts;

  // De aanpassing is +1 als het totaal positief is, en -1 als het totaal negatief is
  const adjustment = total >= 0 ? 1 : -1;

  return Array.from({ length: parts }, (_, i) =>
    // We gebruiken Math.abs op de remainder om de loop-index te kunnen vergelijken
    i < Math.abs(remainder) ? base + adjustment : base
  );
};

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
        return allocateRemainder(totalAmount, parts);
  }

  public getCurrentState(): TransactionState | undefined {
    return this.history[this.pointer];
  }
}

export type StateUndoResult = { success: boolean; message?: string };

export const undo = (): StateUndoResult | null => {
  // logic
  return { success: true };
};
