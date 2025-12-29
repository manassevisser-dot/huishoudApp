import { DATA_KEYS } from '@domain/constants/datakeys';
import { toCents } from '@utils/numbers';

export const migrateToPhoenix = (oldState: any): any => {
  const next: any = { 
    schemaVersion: '1.0',
    [DATA_KEYS.SETUP]: oldState[DATA_KEYS.SETUP] || { aantalMensen: 1 },
    [DATA_KEYS.HOUSEHOLD]: oldState[DATA_KEYS.HOUSEHOLD] || { leden: [] },
    [DATA_KEYS.FINANCE]: { inkomsten: { bedrag: 0 } },
    [DATA_KEYS.EXPENSES]: { wonen: { bedrag: 0 } },
  };

  const getFirstAmount = (obj: any) => {
    const list = obj?.items || obj?.list || [];
    // We gebruiken de toCents util om floating point errors te voorkomen
    return list.length > 0 ? toCents(list[0]?.amount ?? list[0]?.value ?? 0) : 0;
  };

  // Migreer C7 -> FINANCE
  if (oldState.C7 || oldState.income) {
    next[DATA_KEYS.FINANCE].inkomsten.bedrag = getFirstAmount(oldState.C7 || oldState.income);
  }

  // Migreer C10 -> EXPENSES
  if (oldState.C10 || oldState.fixedExpenses) {
    next[DATA_KEYS.EXPENSES].wonen.bedrag = getFirstAmount(oldState.C10 || oldState.fixedExpenses);
  }

  return next;
};