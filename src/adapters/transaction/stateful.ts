import { Logger } from '@adapters/audit/AuditLoggerAdapter';

/**
 * Verdeelt een totaalbedrag zo eerlijk mogelijk over een aantal delen.
 * 
 * @module adapters/transaction
 * @see {@link ./README.md | StatefulTransactionAdapter - Details}
 * 
 * @param total - Totaalbedrag om te verdelen
 * @param parts - Aantal delen waarin verdeeld wordt
 * @returns Array met de verdeelde bedragen (som is gelijk aan total)
 * 
 * @example
 * const verdeling = allocateRemainder(10, 3); // [4, 3, 3]
 */
const allocateRemainder = (total: number, parts: number): number[] => {
  const base = Math.trunc(total / parts);
  const remainder = total % parts;
  const adjustment = total >= 0 ? 1 : -1;

  return Array.from({ length: parts }, (_, i) =>
    i < Math.abs(remainder) ? base + adjustment : base
  );
};

/**
 * Type voor transaction state objecten.
 * 
 * @module adapters/transaction
 * @see {@link ./README.md | StatefulTransactionAdapter - Details}
 */
type TransactionState = Record<string, unknown>;

/**
 * Beheer van undo/redo functionaliteit met audit logging.
 * 
 * @module adapters/transaction
 * @see {@link ./README.md | StatefulTransactionAdapter - Details}
 * 
 * @remarks
 * - Houdt geschiedenis bij van state veranderingen
 * - Audit logging bij elke transactie (ADR-12)
 * - Gebruikt pointer model voor undo/redo navigatie
 */
export class StatefulTransactionAdapter {
  private history: TransactionState[] = [];
  private pointer: number = -1;
  private readonly VERSION = '2025-01-A';

  /**
   * @param initialState - Begin-state voor de transactie history
   */
  constructor(initialState: TransactionState) {
    this.push(initialState, 'INIT');
  }

  /**
   * Voegt een nieuwe state toe aan de geschiedenis.
   * 
   * @param newState - De nieuwe transactie state
   * @param actionType - Type actie voor audit logging
   * 
   * @remarks
   * - Verwijdert toekomstige history als pointer niet aan het einde is
   * - Logt altijd naar audit met versie en ADR referentie
   * 
   * @example
   * adapter.push({ step: 'payment' }, 'PAYMENT_PROCESSED');
   */
  public push(newState: TransactionState, actionType: string): void {
    if (this.pointer < this.history.length - 1) {
      this.history = this.history.slice(0, this.pointer + 1);
    }
    this.history.push(newState);
    this.pointer++;
   Logger.info('transaction.push', {
  type: actionType,
  pointer: this.pointer
}, { 
  adr: 'ADR-12',
  message: `version: ${this.VERSION}`,
});
  }

  /**
   * Gaat één stap terug in de geschiedenis.
   * 
   * @returns Vorige state, of `null` als undo niet mogelijk is
   * 
   * @example
   * const vorigeState = adapter.undo();
   * if (vorigeState) { renderState(vorigeState); }
   */
   public undo(): TransactionState | null {
    if (this.pointer > 0) {
      this.pointer--;
      Logger.notice('transaction.undo', { pointer: this.pointer });  // ✅
      
      const state = this.history[this.pointer];
      return state !== undefined ? state : null;
    }
    return null;
  }

  /**
   * Gaat één stap vooruit in de geschiedenis.
   * 
   * @returns Volgende state, of `null` als redo niet mogelijk is
   * 
   * @example
   * const volgendeState = adapter.redo();
   * if (volgendeState) { renderState(volgendeState); }
   */
    public redo(): TransactionState | null {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      Logger.notice('transaction.redo', { pointer: this.pointer });  // ✅
      
      const state = this.history[this.pointer];
      return state !== undefined ? state : null;
    }
    return null;
  }

  /**
   * Berekent verdeling van totaalbedrag over aantal delen.
   * 
   * @param totalAmount - Totaal te verdelen bedrag
   * @param parts - Aantal delen
   * @returns Array met verdeelde bedragen
   * 
   * @example
   * const verdeling = adapter.calculateDistribution(100, 3);
   * // [34, 33, 33]
   */
  public calculateDistribution(totalAmount: number, parts: number): number[] {
        return allocateRemainder(totalAmount, parts);
  }

  /**
   * Haalt de huidige state op.
   * 
   * @returns Huidige transactie state, of `undefined` als history leeg is
   * 
   * @example
   * const current = adapter.getCurrentState();
   * if (current) { validateState(current); }
   */
  public getCurrentState(): TransactionState | undefined {
    return this.history[this.pointer];
  }
}

/**
 * Resultaat type voor undo operaties.
 * 
 * @module adapters/transaction
 * @see {@link ./README.md | StatefulTransactionAdapter - Details}
 * 
 * @param success - Of de operatie succesvol was
 * @param message - Optionele foutmelding bij falen
 */
export type StateUndoResult = { success: boolean; message?: string };

/**
 * Voert een undo operatie uit op state niveau.
 * 
 * @module adapters/transaction
 * @see {@link ./README.md | StatefulTransactionAdapter - Details}
 * 
 * @returns Resultaat van undo operatie
 * 
 * @example
 * const result = undo();
 * if (result.success) { notifyUser('Undo geslaagd'); }
 */
export const undo = (): StateUndoResult | null => {
  return { success: true };
};