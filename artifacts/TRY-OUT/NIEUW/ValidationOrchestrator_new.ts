// src/app/orchestrators/ValidationOrchestrator.ts
/**
 * @file_intent Publieke interface voor het uitvoeren van validaties op veld- en sectieniveau.
 * @repo_architecture Mobile Industry (MI) - Business Logic / Validation Layer.
 * @term_definition Boundary Validation = Validatie die direct bij invoer (aan de grens) plaatsvindt,
 *   nog voordat de state wordt bijgewerkt.
 * @contract Stateless wrapper rondom de ValidationManager. Vertaalt functionele vragen
 *   ("Is deze sectie ok?") naar technische controles.
 * @ai_instruction Delegeert de werkelijke regel-uitvoering aan de ValidationManager.
 *   canNavigateNext() BLIJFT autoriteit in NavigationOrchestrator — niet dupliceren hier.
 *   validateSection() BLIJFT autoriteit hier — niet elders implementeren.
 * @changes [Fase 3] Toegevoegd: updateAndValidate() — verplaatst uit MasterOrchestrator.updateField().
 *   Combineert boundary-validatie + fso.updateField + business.recompute in één gecontroleerde methode.
 *   ValidationOrchestrator blijft stateless: fso en business worden als params doorgegeven.
 */

import type {
  IValidationOrchestrator,
  SectionValidationResult,
} from './interfaces/IValidationOrchestrator';
import { ValidationManager } from './managers/ValidationManager';
import { FormStateOrchestrator } from './FormStateOrchestrator';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { BusinessManager } from './managers/BusinessManager';

export class ValidationOrchestrator implements IValidationOrchestrator {
  private readonly manager: ValidationManager;

  constructor(private readonly _fso: FormStateOrchestrator) {
    this.manager = new ValidationManager();
  }

  // ─── Bestaande methoden (ongewijzigd) ────────────────────────────

  public validateSection(
    sectionId: string,
    formData: Record<string, unknown>,
  ): SectionValidationResult {
    return this.manager.validateSection(sectionId, formData);
  }

  public validateField(fieldId: string, value: unknown): string | null {
    return this.manager.validateField(fieldId, value);
  }

  public validateAtBoundary(fieldId: string, value: unknown): string | null {
    if (this.manager.shouldValidateAtBoundary(fieldId)) {
      return this.manager.validateField(fieldId, value);
    }
    return null;
  }

  // ─── Nieuw: veld-update met boundary-validatie [Fase 3] ──────────
  /**
   * Verplaatst uit MasterOrchestrator.updateField().
   * Voert boundary-validatie uit, muteert state via fso, en herberekent via business.
   *
   * ⚠️ Bewakingsregel: canNavigateNext() en validateSection() zijn NIET gedupliceerd.
   *   Die blijven autoriteit in respectievelijk NavigationOrchestrator en deze klasse zelf.
   *
   * @param fso  - Doorgegeven als param; houdt de orchestrator stateless.
   * @param business - Doorgegeven als param; voorkomt circulaire constructor-afhankelijkheid.
   */
  public updateAndValidate(
    fieldId: string,
    value: unknown,
    fso: FormStateOrchestrator,
    business: BusinessManager,
  ): void {
    // Gebruik de adapter-validateAtBoundary (retourneert { success, data, error })
    // — NIET this.validateAtBoundary() die string | null retourneert
    const result = validateAtBoundary(fieldId, value);

    if (!result.success) {
      logger.warn('field_update_validation_failed', {
        orchestrator: 'validation',
        action: 'updateAndValidate',
        fieldId,
        errorCode: result.error,
      });
      return;
    }

    fso.updateField(fieldId, result.data);
    business.recompute(fso);
  }
}
