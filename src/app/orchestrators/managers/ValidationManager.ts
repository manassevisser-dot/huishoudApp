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
import { getConstraint } from '@domain/rules/fieldConstraints';

export class ValidationManager {

  /**
   * Valideert een pre-resolved set fieldIds tegen een platte value-map.
   *
   * Wordt uitsluitend aangeroepen vanuit ValidationOrchestrator.validateSection(),
   * die de registry-keten (ScreenRegistry → SectionRegistry → EntryRegistry)
   * en de fso.getValue()-resolutie al heeft afgehandeld.
   *
   * @param fieldIds     - Gefilterde lijst: geen LABEL/ACTION/derived entries.
   * @param resolvedValues - Platte map { fieldId: waarde } opgehaald via fso.getValue().
   */
  public validateFields(
    fieldIds: string[],
    resolvedValues: Record<string, unknown>,
  ): SectionValidationResult {
    const errorFields: string[] = [];
    const errors: Record<string, ValidationError> = {};

    for (const fieldId of fieldIds) {
      const value = resolvedValues[fieldId];
      const msg = this.validateField(fieldId, value);

      if (typeof msg === 'string' && msg.length > 0) {
        errorFields.push(fieldId);
        errors[fieldId] = { message: msg, severity: 'error' };
      }
    }

    return {
      isValid: errorFields.length === 0,
      errorFields,
      errors,
    };
  }

  public validateField(fieldId: string, value: unknown): string | null {
    const constraint = getConstraint(fieldId);
    const isRequired = constraint?.required === true;
    const isEmpty = value === undefined || value === null || value === '';

    // 1. Required-check: alleen blokkeren als de constraint het expliciet vereist
    if (isRequired && isEmpty) {
      // Gebruik het custom message uit de constraint als het er is
      return constraint?.message ?? 'Dit veld is verplicht';
    }

    // 2. Optioneel veld zonder waarde: geen verdere validatie nodig
    if (isEmpty) return null;

    // 3. Zod boundary validator: type- en patroon-check
    const result = validateAtBoundary(fieldId, value);
    return result.success ? null : result.error;
  }

  public shouldValidateAtBoundary(fieldId: string): boolean {
    const fieldsWithLiveValidation = ['email', 'password', 'amountCents', 'postcode'];
    return fieldsWithLiveValidation.includes(fieldId);
  }
}