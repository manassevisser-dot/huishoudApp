import { useState } from 'react';
import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter';
import { executeUpdateAction } from './transactionActions';
import { StatefulTransactionAdapter } from '@adapters/transaction/stateful';
import { formatCurrency } from '@domain/helpers/numbers';

interface TransactionRecord {
  id: string;
  [key: string]: unknown;
}

const getItemsFromState = (state: Record<string, unknown> | undefined | null): TransactionRecord[] => {
  // Expliciete checks voor ESLint strict-boolean-expressions
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
      // We checken op 'name' of 'message' ipv de klasse, om Zod-isolatie te bewaren
      const isValidationError = err instanceof Error && (err.name === 'ZodError' || err.message.includes('validation'));
      
      AuditLogger.log(isValidationError ? 'WARN' : 'ERROR', {
        event: 'transaction_update_failed',
        error: err instanceof Error ? err.message : 'Unknown transaction error'
      });
      setHasError(true);
    }
  };

  return {
    transactions: getItemsFromState(adapter.getCurrentState() as Record<string, unknown>).map(tx => ({
      ...tx,
      displayAmount: formatCurrency(Number(tx.amount ?? 0)),
    })),
    hasError,
    updateTransaction,
    undo: (): void => { if (adapter.undo() !== null) setHasError(false); },
    redo: (): void => { if (adapter.redo() !== null) setHasError(false); }
  };
};