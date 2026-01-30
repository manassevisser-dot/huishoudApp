import { ValueProvider, StateWriter } from '@domain/interfaces';

// Re-export voor de UI (Bridge conform ADR-03)
export type { ValueProvider, StateWriter };
export * from '@domain/helpers/numbers';
export * from '@domain/constants/registry';
// De export van datakeys is verwijderd omdat deze conflicteerde met registry
