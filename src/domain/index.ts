// Verwijder deze regel:
// export * from './interfaces';

// Behoud alleen expliciete façade-exports:
export type { ValueProvider } from './interfaces/ValueProvider';
export type { StateWriter } from './interfaces/StateWriter';

// Constants blijven:
export const DATA_KEYS = {
  SETUP: 'setup',
  MEMBERS: 'members',
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
} as const;