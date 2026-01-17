import { z } from 'zod';

export interface FinanceItem {
  id: string;
  amountCents: number; // integer
  description?: string;
}

export const CONTRACT_VERSION = '1.0.0';

export interface FinanceBucket {
  items: FinanceItem[];
  totalAmountCents?: number;
}

export interface FinanceState {
  income: FinanceBucket;
  expenses: FinanceBucket;
}

// src/shared-types/finance.ts
export interface UndoResult {
  id: string;
  amount: number; // in cents
  currency: 'EUR';
  description?: string;
  reason: string;
  timestamp: string; // ISO
  schemaVersion: string;
}

export const MoneySchema = z.object({
  amount: z.number().int(),
  currency: z.literal('EUR'),
});
