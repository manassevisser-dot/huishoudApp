/**
 * APP LAYER TYPES
 * 
 * Re-exports domain interfaces for use in app and UI layers.
 * This maintains hexagonal architecture: UI imports from @app, not @domain directly.
 * 
 * ADR-01: UI layer should not directly import from domain layer.
 * Solution: App layer re-exports necessary interfaces.
 */



export type { ValueProvider, StateWriter } from '@app/orchestrators/types';
export type {FieldId} from '@domain/core';