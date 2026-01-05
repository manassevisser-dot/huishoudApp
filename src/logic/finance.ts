/**
 * FinanceKernel (Phoenix v1.0)
 * ADR-05: Strict Integer Mapping (Minor Units)
 * ADR-10: Versioned Contracts
 */


export interface UndoPayload {
  id: string;
  amount: number; // Must be integer (minor units)
  currency: string;
  reason?: string;
}

export interface UndoResult {
  id: string;
  amount: number;
  currency: string;
  reason: string;
  timestamp: string;
  schemaVersion: string;
}

export const computePhoenixSummary = (items: UndoResult[]) => {
  // ADR-05: Safety check + Integer math
  if (!Array.isArray(items)) return 0; 
  return items.reduce((acc, item) => acc + (item?.amount || 0), 0);
};

export const CONTRACT_VERSION = '2025-01-A';
