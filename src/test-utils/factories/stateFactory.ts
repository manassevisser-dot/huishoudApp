import { DATA_KEYS } from '@domain/constants/datakeys';
import type { FormState } from '@shared-types/form';
import { deepMerge } from '@utils/objects'; // ✅ Centrale import

/** Recursieve partial type (ADR-11) */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const SCHEMA_VERSION = '1.0' as const;
const isoNow = () => new Date().toISOString();

type MockOverrides = Partial<Omit<FormState, 'data'>> & {
  data?: DeepPartial<FormState['data']>;
  status?: string;
};

export function createMockState(overrides: MockOverrides = {}): FormState {
  const baseState: FormState = {
    schemaVersion: SCHEMA_VERSION,
    activeStep: 'LANDING',
    currentPageId: 'page_1',
    isValid: true,
    data: {
      [DATA_KEYS.SETUP]: {
        aantalMensen: 1,
        aantalVolwassen: 1,
        autoCount: 'Nee',
      },
      [DATA_KEYS.HOUSEHOLD]: { members: [] },
      [DATA_KEYS.FINANCE]: {
        income: { items: [] },
        expenses: { items: [] },
      },
    },
    meta: { lastModified: isoNow(), version: 1 },
  };

  const { data: dataOverride, meta: metaOverride, ...topOverrides } = overrides;

  return {
    ...baseState,
    ...topOverrides,
    data: dataOverride ? deepMerge(baseState.data, dataOverride) : baseState.data,
    meta: metaOverride ? { ...baseState.meta, ...metaOverride } : baseState.meta,
  };
}

export function makePhoenixState(overrides?: MockOverrides): FormState {
  const base: FormState = {
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentPageId: 'setup',
    isValid: true,
    data: {
      setup: { aantalMensen: 0, aantalVolwassen: 0, autoCount: 'Nee' },
      household: { members: [] },
      finance: { income: { items: [] }, expenses: { items: [] } },
    },
    meta: { lastModified: isoNow(), version: 1 },
  };

  const { data: dataOverride, ...topOverrides } = overrides || {};
  return {
    ...base,
    ...topOverrides,
    data: deepMerge(base.data, dataOverride),
  } as FormState;
}
