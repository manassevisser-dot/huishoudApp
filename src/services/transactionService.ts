// src/services/transactionService.ts
import { StorageShim } from '@services/storageShim';
import { toMemberType } from '@domain/research/PrivacyAirlock.WIP';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import type { Member } from '@core/types/core';
// Importeer de nieuwe adapter en types
import { 
  LegacyValidator, 
  type LegacyState, 
  type LegacyMember, 
  type LegacyItem, 
  type ZodJsonPrimitive 
} from '@adapters/validation/LegacyStateAdapter';

/** Finance-item: het enige formaat dat income/expense items kennen */
interface FinanceItem {
  fieldId: string;
  amount: number;
}


// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

/** Zoekt de bron van setup data in legacy state */
function getSetupSource(oldState: LegacyState): Record<string, ZodJsonPrimitive> {
  const source =
    oldState.setup ??
    oldState.data?.setup ??
    undefined;

  if (source !== undefined && source !== null) {
    return source;
  }

  return {};
}

/** Mapt oude leden naar het nieuwe Member-formaat */
function mapLegacyMembers(oldState: LegacyState): Member[] {
  const rawLeden: LegacyMember[] =
    oldState.household?.leden ??
    oldState.data?.household?.leden ??
    oldState.leden ??
    oldState.data?.leden ??
    [];

  return rawLeden.map((lid, index) => {
    const rawName = lid.firstName ?? lid.naam ?? 'Lid';
    const name = rawName.trim();
    const parts = name.split(' ');

    return {
      name,
      entityId: lid.id ?? lid.entityId ?? `m-${index}`,
      memberType: toMemberType(lid.memberType ?? lid.type ?? ''),
      firstName: parts[0] ?? 'Lid',
      lastName: parts.length > 1 ? parts.slice(1).join(' ') : '',
      naam: name,
    } as Member;
  });
}

/** Filtert en normaliseert legacy items naar FinanceItem[] */
function extractFinanceItems(items: LegacyItem[]): FinanceItem[] {
  return items
    .filter((item): item is LegacyItem & { fieldId: string; amount: number } =>
      typeof item.fieldId === 'string' && typeof item.amount === 'number',
    )
    .map((item) => ({
      fieldId: item.fieldId,
      amount: item.amount,
    }));
}

// ════════════════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════════════════

export const migrateTransactionsToPhoenix = async (oldState: Partial<LegacyState>) => {
  const safeState = LegacyValidator.parseState(oldState);

  const setupSource = getSetupSource(safeState);
  const migratedMembers = mapLegacyMembers(safeState);

  return {
    schemaVersion: '1.0' as const,
    data: {
      setup: {
        aantalMensen: Number(setupSource['aantalMensen'] ?? 0),
        aantalVolwassen: Number(setupSource['aantalVolwassen'] ?? 0),
        autoCount: String(setupSource['autoCount'] ?? 'Nee'),
        heeftHuisdieren: Boolean(setupSource['heeftHuisdieren'] ?? false),
      },
      household: {
        members: migratedMembers,
      },
      transactions: safeState.transactions ?? safeState.data?.transactions ?? [],
    },
    meta: {
      lastModified: new Date().toISOString(),
      version: 1,
      itemsProcessed: migratedMembers.length,
    },
  };
};

export const undoLastTransaction = async () => {
  Logger.warn('Undo functionaliteit nog niet geïmplementeerd');
  return null;
};

export const TransactionService = {
  migrate: migrateTransactionsToPhoenix,
  undo: undoLastTransaction,

  getAllTransactions: async (): Promise<FinanceItem[]> => {
    const rawState = await StorageShim.loadState();
    const safeState = LegacyValidator.parseState(rawState);

  
    if (safeState.data === undefined || 
      safeState.data === null || 
      safeState.data.finance === undefined || 
      safeState.data.finance === null) {
      return [];
    }

    const finance = safeState.data.finance;
    const incomeItems = extractFinanceItems(finance.income?.items ?? []);
    const expenseItems = extractFinanceItems(finance.expenses?.items ?? []);

    return [...incomeItems, ...expenseItems];
  },

  clearAll: async (): Promise<void> => {
    return await StorageShim.clearAll();
  },
};