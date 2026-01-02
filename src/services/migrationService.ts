
import { DATA_KEYS, SUB_KEYS } from '@domain/constants/datakeys';
// import { toCents } from '@utils/numbers'; // <-- activeer als je bedragen naar centen wilt
import { FormState, DeepPartial } from '@shared-types/form';
// import { Member } from '@domain/household'; // <-- ongebruikt
import { createMockState } from '@test-utils/index';

type OldDataV0 = {
  aantalMensen?: number | null;
  aantalVolwassen?: number | null;
  leden?: any[]; // legacy fallback
  metadata?: { migratedAt?: string; schemaVersion?: string; itemsProcessed?: unknown };
  income?: { items: any[] };
  expenses?: { items: any[] };
  household?: { members?: any[] };
};

export async function migrateToPhoenix(old: OldDataV0 | null | undefined): Promise<FormState> {
  // 1) Geldige baseline
  const base = createMockState({
    activeStep: 'LANDING',
    currentPageId: '1setupHousehold',
    isValid: true,
  });

  // 2) Null/undefined -> lege, valide Phoenix state met bijgewerkte meta
  if (!old) {
    return {
      ...base,
      meta: { ...base.meta, lastModified: new Date().toISOString() },
    };
  }

  // 3) Members
  const rawMembers = old[DATA_KEYS.HOUSEHOLD]?.members
    ?? old.household?.members
    ?? old.leden
    ?? [];

    const migratedMembers = (Array.isArray(rawMembers) ? rawMembers : []).map((m: any, i: number) => {
      const fullName = String(m.naam ?? m.fullName ?? 'Bewoner').trim();
      const parts = fullName.split(/\s+/);
      
      // Retourneer een object dat voldoet aan de Member interface
      return {
        entityId: m.entityId ?? `mem_${i}`,
        fieldId: m.fieldId ?? `field_${i}`, // [cite: 37]
        firstName: parts[0],
        lastName: parts.slice(1).join(' ') || '',
        memberType: m.memberType ?? 'adult', // [cite: 38]
        age: m.age ?? (m.memberType === 'child' ? 10 : 35), // Voorkom missende age error [cite: 39, 40]
      }; // Verwijder de cast 'as Record<string, unknown>'
    });

  // 4) Setup patch
  const setupPatch: DeepPartial<FormState['data']['setup']> = {
    aantalMensen:
      typeof old.aantalMensen === 'number'
        ? old.aantalMensen
        : (old as any)[DATA_KEYS.SETUP]?.aantalMensen ?? base.data.setup.aantalMensen,
    aantalVolwassen:
      typeof old.aantalVolwassen === 'number'
        ? old.aantalVolwassen
        : (old as any)[DATA_KEYS.SETUP]?.aantalVolwassen ?? base.data.setup.aantalVolwassen,
    autoCount: (old as any)[DATA_KEYS.SETUP]?.autoCount ?? 'Nee',
  };

  // 5) Finance items (optioneel: naar centen mappen)
  const incomeItems = Array.isArray(old.income?.items) ? old.income!.items : [];
  const expenseItems = Array.isArray(old.expenses?.items) ? old.expenses!.items : [];
  // const incomeItems = Array.isArray(old.income?.items)
  //   ? old.income.items.map(x => ({ ...x, amountCents: toCents(x.amount ?? x.value ?? 0) }))
  //   : [];
  // const expenseItems = Array.isArray(old.expenses?.items)
  //   ? old.expenses.items.map(x => ({ ...x, amountCents: toCents(x.amount ?? x.value ?? 0) }))
  //   : [];

  // 6) Meta mapping
  const parsedVersion = Number(old.metadata?.schemaVersion);
  const metaPatch: FormState['meta'] = {
    lastModified: old.metadata?.migratedAt ?? new Date().toISOString(),
    version: Number.isFinite(parsedVersion) ? parsedVersion : base.meta.version,
  };

  // 7) Eindresultaat
  return {
    ...base,
    schemaVersion: '1.0', // pas aan aan je migratieversie en testverwachtingen
    data: {
      ...base.data,
      [DATA_KEYS.SETUP]: { ...base.data.setup, ...setupPatch },
      [DATA_KEYS.HOUSEHOLD]: { members: migratedMembers },
      [DATA_KEYS.FINANCE]: {
        [SUB_KEYS.INCOME]: { items: incomeItems },
        [SUB_KEYS.EXPENSES]: { items: expenseItems },
      },
    },
    meta: metaPatch,
  };
}
