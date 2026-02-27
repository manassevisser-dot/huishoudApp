// src/app/orchestrators/interfaces/IValidationOrchestrator.ts
/**
 * Contract voor validatie-orchestratie: veld-, sectie- en grensvalidatie.
 *
 * @module app/orchestrators/interfaces
 * @see {@link ./README.md | Interfaces — Details}
 */

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationError {
  message: string;
  severity: ValidationSeverity;
  code?: string;
}

export interface SectionValidationResult {
  isValid: boolean;
  errorFields: string[];
  errors: Record<string, ValidationError>;
}

export interface IValidationOrchestrator {
  /**
   * Valideert alle velden van een sectie en retourneert een geaggregeerd rapport.
   *
   * @param sectionId - ID van de te valideren sectie
   * @param formData  - Huidige veldwaarden van de sectie
   * @returns `SectionValidationResult` met `isValid`, `errorFields` en `errors`
   */
  validateSection(sectionId: string, formData: Record<string, unknown>): SectionValidationResult;

  /**
   * Valideert één veld en retourneert een foutmelding of `null`.
   *
   * @param fieldId - Te valideren veld
   * @param value   - Huidige invoerwaarde
   * @returns Foutmelding als validatie faalt, anders `null`
   */
  validateField(fieldId: string, value: unknown): string | null;

  /**
   * Valideert op de systeem-grens (strikte type-check via `validateAtBoundary` adapter).
   *
   * @param fieldId - Te valideren veld
   * @param value   - Invoerwaarde aan de systeemgrens
   * @returns Foutmelding als de waarde de grens niet passeert, anders `null`
   */
  validateAtBoundary(fieldId: string, value: unknown): string | null;
}