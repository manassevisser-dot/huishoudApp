// src/app/orchestrators/interfaces/IValidationOrchestrator.ts

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
   * Valideert een volledige UI-sectie.
   */
  validateSection(sectionId: string, formData: Record<string, unknown>): SectionValidationResult;

  /**
   * Valideert een enkel veld.
   */
  validateField(fieldId: string, value: unknown): string | null;

  /**
   * Valideert bij een boundary (live-check).
   */
  validateAtBoundary(fieldId: string, value: unknown): string | null;
}