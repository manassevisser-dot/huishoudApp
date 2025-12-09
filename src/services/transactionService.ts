//======
// src/services/transactionService.ts

import { DailyTransaction, TransactionSummary } from '../types/transaction';
import { Storage } from './storage';

// In a real scenario, these would be env variables
const N8N_WEBHOOK_URL = 'https://n8n.example.com/webhook/transactions'; // Placeholder
const STORAGE_KEY = '@MockTransactions';

export const TransactionService = {
  /**
   * Saves a transaction via n8n webhook.
   * Logic:
   * 1. Prepares payload with week number and metadata.
   * 2. Sends POST request to n8n.
   * 3. (Fallback) Simulates local persistence for demo purposes if API fails/is mocked.
   */
  async saveTransaction(transaction: DailyTransaction): Promise<boolean> {
    try {
      console.log('Sending transaction to n8n:', transaction);
      
      // MOCK IMPLEMENTATION FOR DEMO (Since we don't have a real N8N instance)
      // In production, uncomment the fetch below:
      /*
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error('API Sync failed');
      */
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Store locally to simulate persistence for the Dashboard to read
      await this._mockLocalSave(transaction);

      return true;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      return false;
    }
  },

  /**
   * Fetches aggregated totals for the dashboard.
   */
  async fetchSummary(): Promise<TransactionSummary> {
    // MOCK IMPLEMENTATION
    const all = await this._mockLocalLoad();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalMonth = all
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Simplistic week calculation for mock
    // In real app, rely on DB aggregation
    const totalWeek = totalMonth; // Placeholder logic

    return {
      totalVariableMonth: totalMonth,
      totalVariableWeek: totalWeek,
    };
  },

  /**
   * NEW P2: Returns last N transactions sorted by date descending
   */
  async list(limit: number = 5): Promise<DailyTransaction[]> {
    const all = await this._mockLocalLoad();
    return all
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  /**
   * NEW P2: Delete single transaction by ID
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const filtered = existing.filter((t: DailyTransaction) => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      return false;
    }
  },

  /**
   * NEW P2: Delete multiple transactions by ID array
   */
  async deleteMultiple(ids: string[]): Promise<boolean> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const idsSet = new Set(ids);
      const filtered = existing.filter((t: DailyTransaction) => !idsSet.has(t.id || ''));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete transactions:', error);
      return false;
    }
  },

  /**
   * NEW P2: Clear all transactions
   */
  async clearAll(): Promise<boolean> {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear transactions:', error);
      return false;
    }
  },

  // --- MOCK STORAGE HELPERS ---
  async _mockLocalSave(t: DailyTransaction) {
    // We reuse the existing generic Storage service to store a separate key
    // This is a "hack" to make the demo functional without a backend
    const importAsyncStorage = async () => {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return AsyncStorage;
    };
    const AsyncStorage = await importAsyncStorage();
    
    const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push({ ...t, id: Math.random().toString(36).substring(7) });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  },

  async _mockLocalLoad(): Promise<DailyTransaction[]> {
    const importAsyncStorage = async () => {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return AsyncStorage;
    };
    const AsyncStorage = await importAsyncStorage();
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
};

