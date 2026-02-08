// src/kernel/finance/mappers.ts
import { CsvItem } from '@domain/finance/StatementIntakePipeline.WIP';

/**
 * Mappers zetten ruwe data om naar domein-modellen.
 * Op dit moment dient dit als een doorgeefluik (placeholder), 
 * maar wel strikt getypeerd conform ADR-06.
 */
export const mapTransactions = (transactions: CsvItem[]): CsvItem[] => {
  // In de toekomst kun je hier transformaties doen, 
  // zoals bedragen valideren of omschrijvingen opschonen.
  return transactions;
};