// src/app/orchestrators/managers/ValidationManager.ts
/**
 * @file_intent Implementeert de validatie-logica door UI-secties te mappen aan domein-validatieregels via de Boundary-adapters.
 * @repo_architecture Mobile Industry (MI) - Validation Management Layer.
 * @term_definition UI_SECTIONS_MAP = Een statische configuratie die bepaalt welke velden gegroepeerd zijn binnen een logische schermsectie. validateAtBoundary = De adapter-functie die Zod-schema's aanroept voor type- en businessrule validatie.
 * @contract Berekent de validatiestatus op zowel veldniveau (real-time) als sectieniveau (form-submission). Het aggregeert individuele veldfouten naar een SectionValidationResult, wat essentieel is voor navigatie-guards in de wizard.
 * @ai_instruction De methode `validateField` voert eerst een generieke 'required' check uit alvorens de gespecialiseerde `validateAtBoundary` aan te roepen. Gebruik `shouldValidateAtBoundary` om te bepalen of een veld 'live' feedback moet geven tijdens het typen.
 */

import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { SectionValidationResult, ValidationError } from "../interfaces/IValidationOrchestrator";
import { UI_SECTIONS } from '@domain/constants/uiSections';

// Sterke interne typing voor configuratie
type UISectionEntry = string | { fieldId: string };
type UISection = { fields: ReadonlyArray<UISectionEntry> };

const UI_SECTIONS_MAP: Record<string, UISection> =
  UI_SECTIONS as unknown as Record<string, UISection>;

export class ValidationManager {

  public validateSection(
    sectionId: string,
    formData: Record<string, unknown>
  ): SectionValidationResult {

    const sectionCfg = UI_SECTIONS_MAP[sectionId];
    const fields = Array.isArray(sectionCfg?.fields) ? sectionCfg.fields : [];

    const fieldIds: string[] = fields
  .map((f: UISectionEntry): string => {
    if (typeof f === 'string') return f;
    return f.fieldId; // TypeScript weet nu dat f de interface { fieldId: string } is
  })
  .filter((fid): fid is string => typeof fid === 'string' && fid.length > 0);

    const errorFields: string[] = [];
    const errors: Record<string, ValidationError> = {};

    for (const fieldId of fieldIds) {
      const value = formData[fieldId];
      const msg = this.validateField(fieldId, value);

      if (typeof msg === 'string' && msg.length > 0) {
        errorFields.push(fieldId);
        errors[fieldId] = { message: msg, severity: 'error' };
      }
    }

    return {
      isValid: errorFields.length === 0,
      errorFields,
      errors
    };
  }

  public validateField(fieldId: string, value: unknown): string | null {
    // 1. Verplicht-check
    if (value === undefined || value === null || value === '') {
      return 'Dit veld is verplicht';
    }

    // 2. Zod boundary validator (echte regels)
    const result = validateAtBoundary(fieldId, value);
    return result.success ? null : result.error;
  }
  public shouldValidateAtBoundary(fieldId: string): boolean {
    const fieldsWithLiveValidation = ['email', 'password', 'amountCents'];
    return fieldsWithLiveValidation.includes(fieldId);
  }
}