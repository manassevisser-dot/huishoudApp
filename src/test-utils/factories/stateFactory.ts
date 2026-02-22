// src/test-utils/factories/stateFactory.ts
import { DATA_KEYS } from '@domain/constants/datakeys';
import type { FormState } from '@core/types/core';
import { deepMerge } from '@utils/objects';

/** Recursieve partial type (ADR-11) - BEHOUDEN */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const SCHEMA_VERSION = '1.0' as const;
const isoNow = () => new Date().toISOString();

/**
 * createMockState - Jouw originele factory
 * Gebruikt voor algemene orchestrator tests.
 */
export function createMockState(overrides: DeepPartial<FormState> = {}): FormState {
  const baseState: FormState = {
    schemaVersion: SCHEMA_VERSION,
    activeStep: 'LANDING',
    currentScreenId: 'screen_1',
    isValid: true,
    viewModels: {}, 
    data: {
      [DATA_KEYS.SETUP]: {
        aantalMensen: 1,
        aantalVolwassen: 1,
        autoCount: 'Geen',
        woningType: 'Koop', // ✅ FIX: Verplicht veld toegevoegd
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
    // ✅ FIX: Behoud van jouw deepMerge logica voor geneste data
    data: dataOverride !== undefined ? deepMerge(baseState.data, dataOverride) : baseState.data,
    meta: metaOverride !== undefined ? { ...baseState.meta, ...metaOverride } : baseState.meta,
  } as FormState;
}

/**
 * makePhoenixState - Specifiek voor de nieuwe Phoenix flow
 */
export function makePhoenixState(overrides?: DeepPartial<FormState>): FormState {
  const base: FormState = {
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentScreenId: 'setup',
    isValid: true,
    viewModels: {},
    data: {
      // ✅ FIX: Gebruik van DATA_KEYS ipv hardcoded 'setup' voor consistentie
      [DATA_KEYS.SETUP]: { 
        aantalMensen: 0, 
        aantalVolwassen: 0, 
        autoCount: 'Geen',
        woningType: 'Koop', // ✅ FIX: Verplicht veld toegevoegd
      },
      [DATA_KEYS.HOUSEHOLD]: { members: [] },
      [DATA_KEYS.FINANCE]: { income: { items: [] }, expenses: { items: [] } },
    },
    meta: { lastModified: isoNow(), version: 1 },
  };

  const currentOverrides = overrides ?? {};
  const { data: dataOverride, ...topOverrides } = currentOverrides;

  return {
    ...base,
    ...topOverrides,
    data: dataOverride !== undefined ? deepMerge(base.data, dataOverride) : base.data,
  } as FormState;
}