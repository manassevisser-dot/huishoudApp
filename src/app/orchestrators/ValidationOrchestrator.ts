// src/app/orchestrators/ValidationOrchestrator.ts

import type { 
  IValidationOrchestrator, 
  SectionValidationResult 
} from "./interfaces/IValidationOrchestrator";
import { ValidationManager } from "./managers/ValidationManager";
import { FormStateOrchestrator } from "./FormStateOrchestrator";

export class ValidationOrchestrator implements IValidationOrchestrator {
  private readonly manager: ValidationManager;

  constructor(private readonly _fso: FormStateOrchestrator) {
    this.manager = new ValidationManager();
  }

  public validateSection(sectionId: string, formData: Record<string, unknown>): SectionValidationResult {
    // Delegatie naar manager
    return this.manager.validateSection(sectionId, formData);
  }

  public validateField(fieldId: string, value: unknown): string | null {
    // Delegatie naar manager
    return this.manager.validateField(fieldId, value);
  }

  public validateAtBoundary(fieldId: string, value: unknown): string | null {
    // Gebruikt de 'should' regel van de manager om te bepalen of validatie nodig is
    if (this.manager.shouldValidateAtBoundary(fieldId)) {
      return this.manager.validateField(fieldId, value);
    }
    return null;
  }
}