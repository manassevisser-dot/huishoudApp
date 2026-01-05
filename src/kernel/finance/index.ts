import { z } from 'zod';

/**
 * ADR-05: Strict Integer Mapping (Minor Units)
 * Dit schema dwingt af dat bedragen altijd integers zijn (centen)
 */
export const MoneySchema = z.object({
  amount: z.number().int({ message: "Amount must be in minor units (integers)" }),
  currency: z.string().length(3).uppercase()
});

export interface UndoPayload {
  id: string;
  amount: number;
  currency: string;
  reason?: string;
}
export type Money = z.infer<typeof MoneySchema>;

export interface UndoResult {
  id: string;
  amount: number;
  currency: string;
  reason: string;
  timestamp: string;
  description?: string;
  schemaVersion: string;
}

export const computePhoenixSummary = (items: UndoResult[]) => {
  return items.reduce((acc, item) => acc + item.amount, 0);
};

export const CONTRACT_VERSION = '2025-01-A';
