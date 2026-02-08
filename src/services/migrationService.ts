// src/services/migrationService.ts
import { DATA_KEYS, SUB_KEYS } from '@domain/constants/datakeys';
import { FormState, DeepPartial, Member } from '@core/types/core';
import { createMockState } from '@test-utils/index';

const DEFAULT_CHILD_AGE = 10;
const DEFAULT_ADULT_AGE = 35;

type OldDataV0 = {
  aantalMensen?: number | null;
  aantalVolwassen?: number | null;
  leden?: unknown[];
  metadata?: { migratedAt?: string; schemaVersion?: string; itemsProcessed?: unknown };
  income?: { items: Record<string, unknown>[] };
  expenses?: { items: Record<string, unknown>[] };
  household?: { members?: Record<string, unknown>[] };
  [key: string]: unknown;
};

// --- Helpers ---

function mapLegacyMember(m: Record<string, unknown>, i: number): Member {
  const naamStr = String(m.naam ?? m.fullName ?? 'Bewoner').trim();
  const parts = naamStr.split(/\s+/);
  const memberType = (m.memberType as 'adult' | 'child' | undefined) ?? 'adult';

  return {
    entityId: String(m.entityId ?? `mem_${i}`),
    fieldId: String(m.fieldId ?? `field_${i}`),
    firstName: parts[0] !== undefined && parts[0] !== '' ? parts[0] : 'Bewoner',
    lastName: parts.slice(1).join(' '),
    memberType,
    age: (m.age as number | undefined) ?? (memberType === 'child' ? DEFAULT_CHILD_AGE : DEFAULT_ADULT_AGE),
  };
}

function getSetupPatch(old: OldDataV0, base: FormState): DeepPartial<FormState['data']['setup']> {
  const setupData = old[DATA_KEYS.SETUP] as Record<string, unknown> | undefined;
  return {
    aantalMensen: typeof old.aantalMensen === 'number' ? old.aantalMensen : (setupData?.aantalMensen as number | undefined) ?? base.data.setup.aantalMensen,
    aantalVolwassen: typeof old.aantalVolwassen === 'number' ? old.aantalVolwassen : (setupData?.aantalVolwassen as number | undefined) ?? base.data.setup.aantalVolwassen,
    autoCount: (setupData?.autoCount as string | undefined) ?? 'Nee',
  };
}

function getFinanceData(old: OldDataV0) {
  return {
    [SUB_KEYS.INCOME]: { items: Array.isArray(old.income?.items) ? old.income!.items : [] },
    [SUB_KEYS.EXPENSES]: { items: Array.isArray(old.expenses?.items) ? old.expenses!.items : [] },
  };
}

function getMetaPatch(old: OldDataV0, base: FormState): FormState['meta'] {
  const parsedVersion = Number(old.metadata?.schemaVersion);
  return {
    lastModified: old.metadata?.migratedAt ?? new Date().toISOString(),
    version: Number.isFinite(parsedVersion) ? parsedVersion : base.meta.version,
  };
}

// --- Main Function ---

export async function migrateToPhoenix(old: OldDataV0 | null | undefined): Promise<FormState> {
  const base = createMockState({ activeStep: 'LANDING', currentPageId: '1setupHousehold', isValid: true });

  if (old === null || old === undefined) {
    return { ...base, meta: { ...base.meta, lastModified: new Date().toISOString() } };
  }

  const raw = old[DATA_KEYS.HOUSEHOLD] as { members?: Record<string, unknown>[] } | undefined;
  const legacyList = raw?.members ?? old.household?.members ?? old.leden ?? [];
  
  const migratedMembers = (Array.isArray(legacyList) ? legacyList : []).map((m, i) => 
    mapLegacyMember(m as Record<string, unknown>, i)
  );

  return {
    ...base,
    schemaVersion: '1.0',
    data: {
      ...base.data,
      [DATA_KEYS.SETUP]: { ...base.data.setup, ...getSetupPatch(old, base) },
      [DATA_KEYS.HOUSEHOLD]: { members: migratedMembers },
      [DATA_KEYS.FINANCE]: getFinanceData(old),
    },
    meta: getMetaPatch(old, base),
  };
}