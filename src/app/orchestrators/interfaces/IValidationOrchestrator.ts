// src/app/orchestrators/interfaces/IValidationOrchestrator.ts
/**
 * @file_intent Definieert het contract voor de validatie-logica die de integriteit van gebruikersinvoer bewaakt op veld-, sectie- en systeemgrens-niveau.
 * @repo_architecture Mobile Industry (MI) - Validation Orchestration Layer.
 * @term_definition ValidationSeverity = De gradatie van een validatiefout, variërend van blokkerende 'errors' tot adviserende 'info'. SectionValidationResult = Een geaggregeerd rapport dat aangeeft of een volledige UI-sectie voldoet aan de gestelde domeinregels.
 * @contract Fungeert als de centrale interface voor de UI om te bepalen of navigatie toegestaan is (via validateSection) en om real-time feedback aan de gebruiker te geven (via validateField). Het dwingt een consistente foutstructuur af voor de gehele applicatie.
 * @ai_instruction Deze orchestrator dient als de 'consumer' van de BoundaryValidation adapters. Gebruik `validateAtBoundary` voor strikte type-checking bij invoer en `validateSection` voor complexe business-rules die meerdere velden beslaan voordat een stap in de wizard wordt afgerond.
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

  validateSection(sectionId: string, formData: Record<string, unknown>): SectionValidationResult;

  validateField(fieldId: string, value: unknown): string | null;

  validateAtBoundary(fieldId: string, value: unknown): string | null;
}