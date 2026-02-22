// src/app/hooks/useTransactionHistory.ts
/**
 * @file_intent Beheert de stateful lifecycle van transacties in de UI, inclusief undo/redo-functionaliteit en error-handling.
 * @repo_architecture Mobile Industry (MI) - UI Logic / Hook Layer.
 * @term_definition adapter = De StatefulTransactionAdapter die de stack van wijzigingen bijhoudt. hasError = Lokale UI-state die aangeeft of de laatste actie (bijv. validatie) is mislukt.
 * @contract Exposeert een stabiele interface voor de UI om transacties te muteren. Gebruikt de AuditLogger om fouten te categoriseren (WARN voor validatie, ERROR voor systeemfouten) zonder de Zod-details te lekken naar de component.
 * @ai_instruction Deze hook initialiseert de adapter via een useState initializer (lazy init) om persistentie over re-renders te garanderen. Gebruik de 'undo' en 'redo' functies om door de historie te navigeren die in de adapter is opgeslagen.
 */
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