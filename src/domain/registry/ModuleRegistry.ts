// src/domain/registry/ModuleRegistry.ts

import type { StyleModuleName } from './StyleRegistry';

/**
 * MODULE REGISTRY (Domain) — CONTRACT
 * De interface is generiek: hij dwingt af dat we voor elke module een type (Key) hebben.
 */
export interface IBaseStyleRegistry<TKeys extends Record<StyleModuleName, string>> {
  modules: TKeys;
}
