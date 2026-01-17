import { DATA_KEYS } from '@domain/constants/datakeys';
import { toCents } from '@domain/helpers/numbers';
import { FormState } from '@shared-types/form';
import { Member } from '@domain/household';

/**
 * Migreert een oude state structuur naar de nieuwe Phoenix 2025 interface.
 */
export const migrateToPhoenix = (oldState: any): FormState => {
  const o = oldState || {};

  const getFirstAmountCents = (obj: any): number => {
    const list = obj?.items || obj?.list || [];
    return list.length > 0 ? toCents(list[0]?.amount ?? list[0]?.value ?? 0) : 0;
  };

  const migratedMembers: Member[] = (o[DATA_KEYS.HOUSEHOLD]?.leden || []).map(
    (lid: any, i: number) => ({
      entityId: lid.id || `m-${i}`,
      naam: lid.naam || lid.firstName || 'Lid',
      memberType: lid.type || 'adult',
    }),
  );

  const migratedData: FormState['data'] = {
    [DATA_KEYS.SETUP]: o[DATA_KEYS.SETUP] || {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: 'Nee',
    },
    [DATA_KEYS.HOUSEHOLD]: {
      members: migratedMembers as any[],
    },
    [DATA_KEYS.FINANCE]: {
      income: {
        items: [],
        totalAmount: getFirstAmountCents(o.C7 || o.income),
      },
      expenses: {
        items: [],
        totalAmount: getFirstAmountCents(o.C10 || o.fixedExpenses),
      },
    },
  };

  return {
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentPageId: 'page_1',
    isValid: true,
    data: migratedData,
    meta: {
      lastModified: new Date().toISOString(),
      version: 1,
    },
  };
};

/**
 * Storage service voor persistentie en migratie.
 * Fix: Named export toegevoegd om TS2305 te verhelpen.
 */
export const storage = {
  migrateToPhoenix,
  loadState: async (): Promise<FormState | null> => {
    // Hier kun je de feitelijke AsyncStorage of localStorage logica toevoegen
    return null;
  },
};
