// src/test-utils/factories/stateFactory.ts
import { DATA_KEYS } from '@domain/constants/datakeys';
import type { FormState } from '@core/types/core';
import { deepMerge } from '@utils/objects';

/** Recursieve partial type (ADR-11) */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const SCHEMA_VERSION = '1.0' as const;
const isoNow = () => new Date().toISOString();

export function createMockState(overrides: DeepPartial<FormState> = {}): FormState {
  const baseState: FormState = {
    schemaVersion: SCHEMA_VERSION,
    activeStep: 'LANDING',
    currentPageId: 'page_1',
    isValid: true,
    // FIX: viewModels toegevoegd aan baseline
    viewModels: {}, 
    data: {
      [DATA_KEYS.SETUP]: {
        aantalMensen: 1,
        aantalVolwassen: 1,
        autoCount: 'Geen',
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
    // FIX: Expliciete undefined check voor linter
    data: dataOverride !== undefined ? deepMerge(baseState.data, dataOverride) : baseState.data,
    meta: metaOverride !== undefined ? { ...baseState.meta, ...metaOverride } : baseState.meta,
  };
}

export function makePhoenixState(overrides?: DeepPartial<FormState>): FormState {
  const base: FormState = {
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentPageId: 'setup',
    isValid: true,
    // FIX: viewModels toegevoegd aan baseline
    viewModels: {},
    data: {
      setup: { aantalMensen: 0, aantalVolwassen: 0, autoCount: 'Geen' },
      household: { members: [] },
      finance: { income: { items: [] }, expenses: { items: [] } },
    },
    meta: { lastModified: isoNow(), version: 1 },
  };

  const currentOverrides = overrides ?? {};
  const { data: dataOverride, ...topOverrides } = currentOverrides;

  return {
    ...base,
    ...topOverrides,
    // FIX: Expliciete undefined check voor linter
    data: dataOverride !== undefined ? deepMerge(base.data, dataOverride) : base.data,
  } as FormState;
}