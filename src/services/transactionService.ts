import { StorageShim } from '@/adapters/storage/storage'; // Importeer je shim
// We importeren de 'wasstraat' helper uit de privacyHelpers
import { toMemberType } from './privacyHelpers';
import { Logger } from './logger';

export const migrateTransactionsToPhoenix = async (oldState: any) => {
  const safeState = oldState || {};

  // Zoek naar de bron van de instellingen (setup)
  const setupSource =
    safeState.setup ||
    safeState.data?.setup ||
    safeState.household ||
    safeState.data?.household ||
    safeState.data ||
    safeState;

  // Leden mapping: we zoeken in alle mogelijke oude plekken naar de lijst met leden
  const oldLeden =
    safeState.household?.leden ||
    safeState.data?.household?.leden ||
    safeState.leden ||
    safeState.data?.leden ||
    [];

  const migratedMembers = oldLeden.map((lid: any, index: number) => {
    const name = lid.firstName || lid.naam || 'Lid';
    const parts = name.trim().split(' ');

    return {
      entityId: lid.id || lid.entityId || `m-${index}`,
      // ✅ FIX: toMemberType controleert nu of het type (zoals 'iets-anders')
      // wel geldig is. Zo niet, dan maakt hij er automatisch 'adult' van.
      memberType: toMemberType(lid.memberType || lid.type),
      firstName: parts[0],
      lastName: parts.slice(1).join(' ') || '',
      naam: name,
    };
  });

  return {
    schemaVersion: '1.0',
    data: {
      setup: {
        aantalMensen: Number(setupSource.aantalMensen || 0),
        aantalVolwassen: Number(setupSource.aantalVolwassen || 0),
        autoCount: setupSource.autoCount || 'Nee',
        heeftHuisdieren: setupSource.heeftHuisdieren ?? false,
      },
      household: {
        members: migratedMembers,
      },
      transactions: safeState.transactions || safeState.data?.transactions || [],
    },
    meta: {
      lastModified: new Date().toISOString(),
      version: 1,
      itemsProcessed: migratedMembers.length,
    },
  };
};
// ✅ VOEG DEZE TOE om de TS-error op te lossen
export const undoLastTransaction = async () => {
  Logger.warn('Undo functionaliteit nog niet geïmplementeerd');
  return null;
};

export const TransactionService = {
  migrate: migrateTransactionsToPhoenix,
  undo: undoLastTransaction,

  // Haal de transacties op uit de opgeslagen state
  getAllTransactions: async (): Promise<any[]> => {
    const state = await StorageShim.loadState();
    // We graven in de Phoenix 1.0 structuur: data -> transactions
    const finance = state?.data?.finance;

    return [...(finance?.income?.items ?? []), ...(finance?.expenses?.items ?? [])];
  },

  // Wis alle data via de shim
  clearAll: async (): Promise<void> => {
    return await StorageShim.clearAll();
  },
};
