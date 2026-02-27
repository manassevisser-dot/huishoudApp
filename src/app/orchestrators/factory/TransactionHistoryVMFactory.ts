// src/app/orchestrators/factory/TransactionHistoryVMFactory.ts
/**
 * @file_intent Bouwt het ViewModel voor het UNDO-scherm (transactiegeschiedenis).
 * @repo_architecture Application Layer - ViewModel Factory.
 * @term_definition
 *   TransactionHistoryVM = Render-klaar model; geen centen, geen null-checks in de UI.
 *   TransactionItemVM = Één rij in de lijst, volledig pre-geformatteerd.
 * @contract
 *   - Input: TransactionHistory | undefined (rechtstreeks uit FormState).
 *   - Output: TransactionHistoryVM (altijd geldig, nooit null).
 *   - Formattering: amountCents → '€ 12,34' via formatCentsToEuro.
 *   - Lege staat: isEmpty = true → UI rendert emptyTitle/emptyMessage.
 * @ai_instruction
 *   Wijzig teksten in WizStrings.undo, niet hier.
 *   Wijzig formattering in formatCentsToEuro, niet hier.
 *   Voeg geen UI-logica toe: dit is een pure transformatiefunctie.
 */

import WizStrings from '@config/WizStrings';
import type { TransactionHistory, TransactionRecord } from '@core/types/core';
type UndoStrings = typeof WizStrings.undo;
// ─── ViewModel types ──────────────────────────────────────────────────────────

export interface TransactionItemVM {
  /** Stabiele key voor React list-rendering */
  id: string;
  /** Pre-geformatteerde datum, bijv. '01-01-2026' */
  date: string;
  description: string;
  /** Pre-geformatteerd bedrag, bijv. '€ 12,34' */
  amountDisplay: string;
  category: string;
  paymentMethod: string;
}

export interface TransactionHistoryVM {
  isEmpty: boolean;

  // ── Lege staat ──────────────────────────────────────────
  emptyTitle: string;
  emptyMessage: string;

  // ── Gevulde staat ────────────────────────────────────────
  title: string;
  /** Huidig zichtbare transactie (present in de stack) */
  present: TransactionItemVM | null;
  /** Alle vorige transacties (past in de stack), nieuwste eerst */
  pastItems: TransactionItemVM[];
  /** Aantal stappen dat terug kan */
  canUndo: boolean;
  /** Aantal stappen dat vooruit kan */
  canRedo: boolean;
}

// ─── Formatter ────────────────────────────────────────────────────────────────

function formatCentsToEuro(cents: number): string {
  const euros = cents / 100;
  return `\u20ac ${euros.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function toItemVM(record: TransactionRecord): TransactionItemVM {
  return {
    id: record.id,
    date: record.date,
    description: record.description,
    amountDisplay: formatCentsToEuro(record.amountCents),
    category: record.category ?? '',
    paymentMethod: record.paymentMethod ?? '',
  };
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export const TransactionHistoryVMFactory = {
  build(history: TransactionHistory | undefined): TransactionHistoryVM {
    const strings = WizStrings.undo as UndoStrings;

    const isEmpty =
      history === undefined ||
      (history.present === null && history.past.length === 0);

    if (isEmpty === true) {
      return {
        isEmpty: true,
        emptyTitle: strings.emptyTitle,
        emptyMessage: strings.emptyMessage,
        title: strings.screenTitle,
        present: null,
        pastItems: [],
        canUndo: false,
        canRedo: false,
      };
    }

    return {
      isEmpty: false,
      emptyTitle: strings.emptyTitle,
      emptyMessage: strings.emptyMessage,
      title: strings.screenTitle,
      present: history.present !== null ? toItemVM(history.present) : null,
      pastItems: [...history.past].reverse().map(toItemVM),
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
    };
  },
};
