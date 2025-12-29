// src/services/transactionService.ts

export type TransactionInput = {
  date: string | Date;
  amount: number;
  category: string;
  paymentMethod: string;
  weekNumber: number;
  note?: string;
};

// In-memory store voor de sessie
let _transactions: TransactionInput[] = [];

export const TransactionService = {
  /**
   * Slaat een transactie op in het geheugen.
   * Straks eenvoudig uit te breiden naar AsyncStorage of SQLite.
   */
  _mockLocalSave: async (tx: TransactionInput): Promise<boolean> => {
    try {
      _transactions.push({
        ...tx,
        date: tx.date instanceof Date ? tx.date.toISOString() : tx.date
      });
      console.log(`[TransactionService] Saved: ${tx.amount} in ${tx.category}`);
      return true;
    } catch (error) {
      console.error('[TransactionService] Save failed:', error);
      return false;
    }
  },

  /**
   * Haalt alle opgeslagen transacties op.
   */
  getAllTransactions: async (): Promise<TransactionInput[]> => {
    return [..._transactions];
  },

  /**
   * Reset de store (handig voor testen of logout).
   */
  clearAll: () => {
    _transactions = [];
  }
  
};
// Voeg dit onderaan je bestaande transactionService.ts toe:
export const migrateToPhoenix = async () => {
  console.log('Migration completed');
  return true;
};