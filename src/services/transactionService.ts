import { FormState } from '@shared-types/form';

export const migrateTransactionsToPhoenix = async (oldData: any): Promise<FormState> => {
  
  const newState: FormState = {
    schemaVersion: '1.0',
    activeStep: 'WIZARD',
    
    // ✅ FIX: Deze twee velden waren verplicht volgens je FormState type
    currentPageId: '1setupHousehold', // Startpagina (of '1setupHousehold' afhankelijk van je config)
    isValid: false,      // Default op false zetten zodat validatie opnieuw draait
    
    data: {
      setup: {
        aantalMensen: oldData?.aantalMensen ?? 0,
        aantalVolwassen: oldData?.aantalVolwassen ?? 0,
      },
      household: { 
        members: [] 
      },
      finance: {},
    },
    meta: {
      lastModified: new Date().toISOString(),
      version: 1,
    },
  };

  return newState;
};

export const undoLastTransaction = async () => { 
  console.log('Undo not implemented yet');
};

export const TransactionService = {
  migrate: migrateTransactionsToPhoenix,
  undo: undoLastTransaction,
};