// src/app/orchestrators/interfaces/IValueOrchestrator.ts
/**
 * Contract voor waarde-opvraag: levert een `ValueViewModel` per veld-ID.
 *
 * @module app/orchestrators/interfaces
 * @see {@link ./README.md | Interfaces — Details}
 */
import { PrimitiveType } from '@domain/registry/PrimitiveRegistry';

export interface ValueViewModel {
  fieldId: string;
  value: unknown;
  primitiveType: PrimitiveType;
  options?: readonly string[];
}

export interface IValueOrchestrator {
  /**
   * Haalt het ViewModel op voor een veld-ID, inclusief type en opties.
   *
   * @param fieldId - Het op te zoeken veld
   * @returns `ValueViewModel` als het veld bestaat, anders `null`
   */
  getValueModel(fieldId: string): ValueViewModel | null;
}