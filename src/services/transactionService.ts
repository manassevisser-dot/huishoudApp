//======
// src/services/transactionService.ts

import { DailyTransaction, TransactionSummary } from '@shared-types/transaction';
import logger from '@services/logger'; 
// Note: __DEV__ logging is safe in React Native

// In a real scenario, these would be env variables
const N8N_WEBHOOK_URL = 'https://n8n.example.com/webhook/transactions'; // Placeholder
const STORAGE_KEY = '@MockTransactions';

// Helper: narrow naar items met geldige date-string
const hasValidDate = (t: { date?: string }): t is { date: string } =>
  typeof t.date === 'string' && !Number.isNaN(new Date(t.date).getTime());

export const TransactionService = {
  /**
   * Saves a transaction via n8n webhook (mocked).
   * In production:
   *  - Enable fetch(N8N_WEBHOOK_URL, ...) and differentiate errors:
   *    TypeError => network failure (offline/DNS/timeout)
   *    !response.ok => HTTP failure (e.g., 500 server error or 400 validation)
   */
  async saveTransaction(transaction: DailyTransaction): Promise<boolean> {
    try {
      // MOCK: simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Store locally to simulate persistence
      await (this as any)._mockLocalSave(transaction);
      return true;
    } catch (error: any) {
      // Differentiated logging
      if (error instanceof TypeError) {
        logger.error('Network error while saving transaction (TypeError):', error);
      } else {
        logger.error('Failed to save transaction:', error);
      }
      return false;
    }
  },

  /**
   * Fetches aggregated totals for the dashboard (mock).
   * Computes monthly totals from local transactions.
   */
  async fetchSummary(): Promise<TransactionSummary> {
    const all = await (this as any)._mockLocalLoad();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1) alleen items met geldige datum
    // 2) filter op huidige maand/jaar
    // 3) reduce naar bedrag (getal)
    const totalMonth = all
      .filter(hasValidDate)
      .filter((t: any) => {
        const d = new Date(t.date); // t.date is nu zeker string
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum: any, t: any) => sum + (t.amount ?? 0), 0);

    // Simplistische weekberekening in mock (ok voor MVP)
    const totalWeek = totalMonth;

    return {
      totalVariableMonth: totalMonth,
      // FIX 1: Removed duplicate 'total' keyword that caused a syntax error
      totalVariableWeek: totalWeek,
    };
  },

  /**
   * Returns last N transactions sorted by date descending (mock).
   */
  async list(limit: number = 5): Promise<DailyTransaction[]> {
    const all = await (this as any)._mockLocalLoad();
    return all
      .filter(hasValidDate)
      .sort((a: any, b: any) => {
        const tb = new Date(b.date).getTime();
        const ta = new Date(a.date).getTime();
        return tb - ta;
      })
      .slice(0, limit);
  },

  /**
   * Delete single transaction by ID (mock).
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(
        (m) => m.default,
      );
      const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DailyTransaction[] = existingRaw ? JSON.parse(existingRaw) : [];
      // FIX 2: Check that t.id is defined before comparing to the input 'id' (string | undefined vs string)
      const filtered = existing.filter((t: DailyTransaction) => !t.id || t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      logger.error('Failed to delete transaction:', error);
      return false;
    }
  },

  /**
   * Delete multiple transactions by ID array (mock).
   */
  async deleteMultiple(ids: string[]): Promise<boolean> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(
        (m) => m.default,
      );
      const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DailyTransaction[] = existingRaw ? JSON.parse(existingRaw) : [];
      const idsSet = new Set(ids);
      // FIX 3: Check that t.id is defined before checking if the set has it
      const filtered = existing.filter((t: DailyTransaction) => !t.id || !idsSet.has(t.id));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      logger.error('Failed to delete transactions:', error);
      return false;
    }
  },

  /**
   * Clear all transactions (mock).
   */
  async clearAll(): Promise<boolean> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(
        (m) => m.default,
      );
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      logger.error('Failed to clear transactions:', error);
      return false;
    }
  },

  // --- MOCK STORAGE HELPERS ---
  async _mockLocalLoad(): Promise<DailyTransaction[]> {
    const importAsyncStorage = async () => {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return AsyncStorage;
    };
    const AsyncStorage = await importAsyncStorage();
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      if (__DEV__) logger.info('Malformed transactions JSON in storage; returning empty list', e);
      return [];
    }
  },
}; // <--- Hier sluit de TransactionService

/**
 * Phoenix Migration Handler (ADR-13)
 * Converteert legacy C7 data naar de nieuwe Phoenix structuur.
 */
export const migrateToPhoenix = (oldState: any): any => {
  const newState = {
    activeStep: 'landing',
    data: {},
    finance: { inkomsten: { bedrag: 0 } }
  };

  if (oldState?.C7?.items?.[0]?.amount) {
    const legacyAmount = oldState.C7.items[0].amount;
    // Zet "1.250,50" om naar 125050 centen
    const cleanAmount = legacyAmount.replace(/\./g, '').replace(',', '.');
    newState.finance.inkomsten.bedrag = Math.round(parseFloat(cleanAmount) * 100);
  }

  return newState;
};