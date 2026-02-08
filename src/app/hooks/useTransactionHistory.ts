// src/app/hooks/useTransactionHistory.ts
import { useState } from 'react';
import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter';
import { ZodError } from 'zod';
import { executeUpdateAction } from './transactionActions';
import { StatefulTransactionAdapter } from '@adapters/transaction/stateful';

interface TransactionRecord {
  id: string;
  [key: string]: unknown;
}

// Helper buiten de hook om regels te besparen en logica te scheiden
const getItemsFromState = (state: Record<string, unknown> | undefined): TransactionRecord[] => {
  if (state !== undefined && state !== null && Array.isArray(state.items)) {
    return state.items as TransactionRecord[];
  }
  return [];
};

export const useTransactionHistory = (initialData: TransactionRecord[] = []) => {
  const [adapter] = useState<StatefulTransactionAdapter>(
    () => new StatefulTransactionAdapter({ items: initialData })
  );
  const [hasError, setHasError] = useState(false);

  const updateTransaction = (inputValue: number, parts: number): void => {
    try {
      executeUpdateAction(adapter, inputValue, parts);
      setHasError(false);
    } catch (err) {
      AuditLogger.log(err instanceof ZodError ? 'WARN' : 'ERROR', {
        event: 'transaction_update_failed',
        error: err instanceof Error ? err.message : 'Unknown'
      });
      setHasError(true);
    }
  };

  return {
    transactions: getItemsFromState(adapter.getCurrentState() as Record<string, unknown>),
    hasError,
    updateTransaction,
    undo: (): void => { if (adapter.undo() !== null) setHasError(false); },
    redo: (): void => { if (adapter.redo() !== null) setHasError(false); }
  };
};