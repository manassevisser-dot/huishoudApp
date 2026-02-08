// src/app/orchestrators/interfaces/IValidationOrchestrator.ts

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationError {
  message: string;            // Het vertaalde token/bericht
  severity: ValidationSeverity;
  code?: string;              // De oorspronkelijke Zod-foutcode of constraint-type
}

export interface SectionValidationResult {
  isValid: boolean;           // TRUE als er GEEN 'error' severity aanwezig is
  errorFields: string[];      // Lijst van velden met severity 'error'
  errors: Record<string, ValidationError>; // Map van fieldId naar volledige fout-info
}

export interface IValidationOrchestrator {
  /**
   * Valideert een volledige UI-sectie (bijv. 'HOUSEHOLD_SETUP').
   * Gebruikt de formData uit de FSO en de regels uit de Zod-schemas.
   * Wordt door de Navigator gebruikt om canNavigateNext te bepalen.
   */
  validateSection(sectionId: string, formData: Record<string, unknown>): SectionValidationResult;

  /**
   * Valideert een enkel veld voor directe feedback tijdens interactie.
   * Retourneert het vertaalde bericht of null bij succes.
   */
  validateField(fieldId: string, value: unknown): string | null;
}