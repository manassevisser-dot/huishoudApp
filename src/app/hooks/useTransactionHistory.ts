import { useState } from 'react';
import { StatefulTransactionAdapter } from '@adapters/transaction/stateful';
import { ZodError } from 'zod';
import { MoneySchema } from '@shared-types/finance';

/**
 * ADR-02: Domain Types
 * Deze interfaces horen eigenlijk in src/domain/types.ts
 * maar staan hier voor demonstratie
 */
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

/**
 * Custom Hook: useTransactionHistory
 *
 * @architecture
 * - ADR-01 (SoC): Scheiding tussen UI en Business Logic
 * - ADR-03: Adapter patroon voor state management
 * - ADR-04: "Dumb UI" - Hook bevat alle orchestratie
 * - ADR-06: Defensive programming met type guards
 * - ADR-16: Lazy initialization voor performance
 *
 * @responsibilities
 * - Transaction state management
 * - Error handling en validation
 * - Undo/Redo orchestratie via adapter
 * - Type-safe output garantie
 */
export const useTransactionHistory = (initialData: Transaction[] = []) => {
  // ADR-16: Lazy initialization - adapter wordt slechts 1x aangemaakt
  const [adapter] = useState(() => new StatefulTransactionAdapter(initialData));

  // Local state management
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);
  const [error, setError] = useState<string | null>(null);

  /**
   * ADR-06: Defensive Programming
   * Garandeer dat output altijd een werkbare array is
   * Voorkomt runtime crashes bij undefined/null state
   */
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  /**
   * Update transactie met business rule validation
   * @throws ZodError bij floats (ADR-05: integers only)
   */
  const updateTransaction = (inputValue: number, parts: number) => {
    setError(null);
    try {
      // ADR-05: Valideer input vóór business logic
      MoneySchema.parse({ amount: inputValue, currency: 'EUR' });

      // ADR-03: Adapter bevat de domain logic
      const distribution = adapter.calculateDistribution(inputValue, parts);
      const currentView = adapter.getCurrentState();

      const newState = {
        ...currentView,
        distribution,
        lastUpdated: new Date().toISOString(),
      };

      // ADR-12: Audit trail via adapter
      adapter.push(newState, 'USER_UPDATE');

      // In productie zou dit via een subscription/observer pattern gaan
      // Voor nu: direct state sync (optioneel)
      // setTransactions(adapter.getCurrentState());
    } catch (err) {
      // ADR-05: Type-safe error handling
      if (err instanceof ZodError) {
        setError('Input violation: Integers only (ADR-05)');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  /**
   * Undo naar vorige state
   * ADR-03: Delegeert naar adapter
   */
  const undo = () => {
    const prevState = adapter.undo();
    if (prevState) {
      // In productie: sync met global state/context
      // Voor nu: no-op (demo purposes)
    }
  };

  /**
   * Redo naar volgende state
   * ADR-03: Delegeert naar adapter
   */
  const redo = () => {
    const nextState = adapter.redo();
    if (nextState) {
      // In productie: sync met global state/context
    }
  };

  /**
   * Clear alle transacties
   * ADR-04: Pure state mutation, geen side effects
   */
  const clearAll = () => {
    setTransactions([]);
  };

  /**
   * Interface Segregation Principle (ISP)
   * Exposeer alleen wat de UI echt nodig heeft
   *
   * @returns Clean API voor consumer components
   */
  return {
    // Data
    transactions: safeTransactions,
    error,

    // Actions
    updateTransaction,
    undo,
    redo,
    clearAll,

    // Debug (ADR-17: Accepted Risk voor development tools)
    _debugAdapterState: adapter.getCurrentState(),
  };
};
