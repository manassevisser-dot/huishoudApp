// src/services/migrationService.ts
import { DATA_KEYS, SUB_KEYS } from '@domain/constants/datakeys';
import { FormState, DeepPartial, Member } from '@core/types/core';
import { createMockState } from '@test-utils/index';

const DEFAULT_CHILD_AGE = 10;
const DEFAULT_ADULT_AGE = 35;

type OldDataV0 = {
  aantalMensen?: unknown;
  aantalVolwassen?: unknown;
  leden?: unknown[];
  metadata?: { migratedAt?: string; schemaVersion?: string; itemsProcessed?: unknown };
  income?: { items: unknown[] };
  expenses?: { items: unknown[] };
  household?: { members?: unknown[] };
  [key: string]: unknown;
};

// --- Type guards ---
const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object';
const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

// --- Helpers ---

function getMemberType(input: unknown): 'adult' | 'child' {
  return input === 'child' ? 'child' : 'adult';
}

function getAge(input: unknown, type: 'adult' | 'child'): number {
  return typeof input === 'number' ? input : (type === 'child' ? DEFAULT_CHILD_AGE : DEFAULT_ADULT_AGE);
}

function mapLegacyMember(m: unknown, i: number): Member {
  if (!isObject(m)) {
    return {
      entityId: `mem_${i}`,
      fieldId: `field_${i}`,
      firstName: 'Bewoner',
      lastName: '',
      memberType: 'adult',
      age: DEFAULT_ADULT_AGE,
    };
  }

  const naamStr = String(m.naam ?? m.fullName ?? 'Bewoner').trim();
  const parts = naamStr.split(/\s+/);
  const memberType = getMemberType(m.memberType);
  const age = getAge(m.age, memberType);

  return {
    entityId: String(m.entityId ?? `mem_${i}`),
    fieldId: String(m.fieldId ?? `field_${i}`),
    firstName: parts[0] !== '' ? parts[0] : 'Bewoner',
    lastName: parts.slice(1).join(' '),
    memberType,
    age,
  };
}

function toNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

function getSetupPatch(old: OldDataV0, base: FormState): DeepPartial<FormState['data']['setup']> {
  const setupData = old[DATA_KEYS.SETUP];
  const setupRecord = isObject(setupData) ? setupData : {};

  return {
    aantalMensen: toNumber(old.aantalMensen) ?? toNumber(setupRecord.aantalMensen) ?? base.data.setup.aantalMensen,
    aantalVolwassen: toNumber(old.aantalVolwassen) ?? toNumber(setupRecord.aantalVolwassen) ?? base.data.setup.aantalVolwassen,
    autoCount: (typeof setupRecord.autoCount === 'string') ? setupRecord.autoCount : 'Nee',
  };
}

function getFinanceData(old: OldDataV0) {
  const incomeItems = isArray(old.income?.items)
    ? old.income!.items.map(item => (isObject(item) ? item : {}))
    : [];

  const expenseItems = isArray(old.expenses?.items)
    ? old.expenses!.items.map(item => (isObject(item) ? item : {}))
    : [];

  return {
    [SUB_KEYS.INCOME]: { items: incomeItems as Record<string, unknown>[] },
    [SUB_KEYS.EXPENSES]: { items: expenseItems as Record<string, unknown>[] },
  };
}

function getMetaPatch(old: OldDataV0, base: FormState): FormState['meta'] {
  const parsedVersion = Number(old.metadata?.schemaVersion);
  return {
    lastModified: old.metadata?.migratedAt ?? new Date().toISOString(),
    version: Number.isFinite(parsedVersion) ? parsedVersion : base.meta.version,
  };
}

function extractMembers(old: OldDataV0): unknown[] {
  const raw = old[DATA_KEYS.HOUSEHOLD];
  if (isObject(raw) && isArray(raw.members)) {
    return raw.members;
  }
  if (old.household !== null && typeof old.household === 'object' && Array.isArray((old.household as Record<string, unknown>).members)) {
    return (old.household as Record<string, unknown>).members as unknown[];
  }
  if (isArray(old.leden)) {
    return old.leden;
  }
  return [];
}

// --- Main Function ---

export async function migrateToPhoenix(old: OldDataV0 | null | undefined): Promise<FormState> {
  const base = createMockState({ activeStep: 'LANDING', currentPageId: '1setupHousehold', isValid: true });

  if (old === null || old === undefined) {
    return { ...base, meta: { ...base.meta, lastModified: new Date().toISOString() } };
  }

  const legacyList = extractMembers(old);
  const migratedMembers = legacyList.map((m, i) => mapLegacyMember(m, i));

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