import { type MemberType } from '../domain/household';
// We importeren de 'wasstraat' helper uit de privacyHelpers
import { toMemberType } from './privacyHelpers';

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
    safeState.data?.leden || [];
  
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
      naam: name
    };
  });

  return {
    schemaVersion: '1.0', 
    data: {
      setup: {
        aantalMensen: Number(setupSource.aantalMensen || 0),
        aantalVolwassen: Number(setupSource.aantalVolwassen || 0),
        autoCount: setupSource.autoCount || 'Nee',
        heeftHuisdieren: setupSource.heeftHuisdieren ?? false
      },
      household: {
        members: migratedMembers
      },
      transactions: safeState.transactions || safeState.data?.transactions || []
    },
    meta: {
      lastModified: new Date().toISOString(),
      version: 1,
      itemsProcessed: migratedMembers.length
    }
  };
};
// ✅ VOEG DEZE TOE om de TS-error op te lossen
export const undoLastTransaction = async () => {
  console.log('Undo functionaliteit nog niet geïmplementeerd');
  return null;
};

export const TransactionService = {
  migrate: migrateTransactionsToPhoenix,
  undo: undoLastTransaction,
};
