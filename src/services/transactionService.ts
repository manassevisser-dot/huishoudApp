// src/services/transactionService.ts

import { z } from 'zod';
import { StorageShim } from '@services/storageShim';
import { toMemberType } from '@domain/research/PrivacyAirlock.WIP';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';

// 1. Verbeterde Zod Schemas
const legacyMemberSchema = z.object({
  id: z.string().optional(),
  entityId: z.string().optional(),
  firstName: z.string().optional(),
  naam: z.string().optional(),
  memberType: z.string().optional(),
  type: z.string().optional(),
});

// Fix voor de record fout: z.record(key, value)
const legacyStateSchema = z.object({
  setup: z.record(z.string(), z.unknown()).optional(),
  data: z.object({
    setup: z.record(z.string(), z.unknown()).optional(),
    household: z.object({ leden: z.array(z.unknown()).optional() }).optional(),
    leden: z.array(z.unknown()).optional(),
    transactions: z.array(z.unknown()).optional(),
    finance: z.object({
      income: z.object({ items: z.array(z.unknown()).optional() }).optional(),
      expenses: z.object({ items: z.array(z.unknown()).optional() }).optional(),
    }).optional(),
  }).optional(),
  household: z.object({ leden: z.array(z.unknown()).optional() }).optional(),
  leden: z.array(z.unknown()).optional(),
  transactions: z.array(z.unknown()).optional(),
}).passthrough();

type LegacyState = z.infer<typeof legacyStateSchema>;

/**
 * Zoekt de bron van de setup data.
 */
function getSetupSource(oldState: LegacyState): Record<string, unknown> {
  const source = oldState.setup ?? 
                 oldState.data?.setup ?? 
                 oldState.household ?? 
                 oldState.data?.household ?? 
                 oldState.data ?? 
                 oldState;
  
  return (typeof source === 'object' && source !== null) ? (source as Record<string, unknown>) : {};
}

/**
 * Mapt oude leden.
 */
function mapLegacyMembers(oldState: LegacyState): unknown[] {
  const rawLeden = oldState.household?.leden ?? 
                   oldState.data?.household?.leden ?? 
                   oldState.leden ?? 
                   oldState.data?.leden ?? 
                   [];

  return rawLeden.map((item, index) => {
    // We gebruiken safeParse om crashes te voorkomen bij corrupte data
    const result = legacyMemberSchema.safeParse(item);
    const lid = result.success ? result.data : {};
    
    const rawName = lid.firstName ?? lid.naam ?? 'Lid';
    const name = rawName.trim();
    const parts = name.split(' ');

    return {
      entityId: lid.id ?? lid.entityId ?? `m-${index}`,
      memberType: toMemberType(lid.memberType ?? lid.type ?? ''),
      firstName: parts[0] ?? 'Lid',
      lastName: parts.length > 1 ? (parts.slice(1).join(' ')) : '',
      naam: name,
    };
  });
}

export const migrateTransactionsToPhoenix = async (oldState: unknown) => {
  const result = legacyStateSchema.safeParse(oldState ?? {});
  const safeState = result.success ? result.data : {};
  
  const setupSource = getSetupSource(safeState);
  const migratedMembers = mapLegacyMembers(safeState);

  return {
    schemaVersion: '1.0',
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

  getAllTransactions: async (): Promise<unknown[]> => {
    const rawState = await StorageShim.loadState();
    const result = legacyStateSchema.safeParse(rawState);
    
    // EXPLICIETE CHECK: vergelijk het object met !== undefined en !== null
    if (!result.success || result.data.data?.finance === undefined || result.data.data.finance === null) {
      return [];
    }
    
    const finance = result.data.data.finance;

    return [
      ...(finance.income?.items ?? []), 
      ...(finance.expenses?.items ?? [])
    ];
  },

  clearAll: async (): Promise<void> => {
    return await StorageShim.clearAll();
  },
};