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
 * @changes [Fase 3] updateAndValidate() verplaatst uit MasterOrchestrator.updateField().
 *   Dependencies (fso, business) geïnjecteerd via constructor i.p.v. method-parameters
 *   om SRP en parameter-limiet te respecteren.
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
import { ScreenRegistry } from '@domain/registry/ScreenRegistry';
import { SectionRegistry } from '@domain/registry/SectionRegistry';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { PRIMITIVE_TYPES } from '@domain/registry/PrimitiveRegistry';

export class ValidationOrchestrator implements IValidationOrchestrator {
  private readonly manager: ValidationManager;

  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly business?: BusinessManager,
  ) {
    this.manager = new ValidationManager();
  }

  // ─── Sectie-validatie via ScreenRegistry + SectionRegistry ────────

  /**
   * Valideert alle velden van het opgegeven scherm (screenId).
   *
   * Keten: screenId → ScreenRegistry.sectionIds → SectionRegistry.fieldIds
   *        → EntryRegistry (skip derived/action) → fso.getValue() → validateField()
   *
   * @param screenId  - De activeStep/currentScreenId (bijv. 'WIZARD_SETUP_HOUSEHOLD').
   * @param _formData - Niet meer gebruikt; waarden worden via fso.getValue() opgehaald.
   *                    Parameter blijft voor interface-compatibiliteit (IValidationOrchestrator).
   */
  public validateSection(
    screenId: string,
    _formData: Record<string, unknown>,
  ): SectionValidationResult {
    const fieldIds = this.resolveValidatableFieldIds(screenId);

    if (fieldIds.length === 0) {
      // Scherm zonder velden (bijv. SPLASH, LANDING, APP_STATIC) → altijd valid
      return { isValid: true, errorFields: [], errors: {} };
    }

    // Bouw een platte value-map via fso.getValue() — de enige bron van waarheid
    const resolvedValues: Record<string, unknown> = {};
    for (const fieldId of fieldIds) {
      resolvedValues[fieldId] = this.fso.getValue(fieldId);
    }

    return this.manager.validateFields(fieldIds, resolvedValues);
  }

  /**
   * Leidt valide fieldIds af voor een screenId.
   * Filtert derived (LABEL) en ACTION entries: die hebben geen invoer-validatie.
   */
  private resolveValidatableFieldIds(screenId: string): string[] {
    const screen = ScreenRegistry.getDefinition(screenId);
    if (screen === null) {
      logger.warn('validation_screen_not_found', {
        orchestrator: 'validation',
        action: 'resolveValidatableFieldIds',
        screenId,
      });
      return [];
    }

    return screen.sectionIds.flatMap((sectionId) => {
      const section = SectionRegistry.getDefinition(sectionId);
      if (section === null) return [];

      return section.fieldIds.filter((fieldId) => {
        const entry = EntryRegistry.getDefinition(fieldId);
        if (entry === null) return false;
        // Derived labels en ACTION-knoppen hebben geen invulbare waarde
        if (entry.isDerived === true) return false;
        if (entry.primitiveType === PRIMITIVE_TYPES.ACTION) return false;
        if (entry.primitiveType === PRIMITIVE_TYPES.LABEL) return false;
        return true;
      });
    });
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
   * ✅ Parameter count: 2 (binnen de limiet). fso en business zijn via constructor geïnjecteerd.
   */
  public updateAndValidate(fieldId: string, value: unknown): void {
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

    this.fso.updateField(fieldId, result.data);
    this.business?.recompute(this.fso);
  }
}