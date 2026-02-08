// src/app/orchestrators/ValidationOrchestrator.ts

import {
  IValidationOrchestrator,
  SectionValidationResult,
  ValidationError,
} from "./interfaces/IValidationOrchestrator";
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { ValidationManager } from "./managers/ValidationManager";
import { FormStateOrchestrator } from "./FormStateOrchestrator";


// Minimal, maar 100% type-veilig voor jouw shape:
type UISectionEntry = string | { fieldId: string };
type UISection = { fields: ReadonlyArray<UISectionEntry> };

// Sterk getypeerde view op UI_SECTIONS (zonder any)
const UI_SECTIONS_MAP: Record<string, UISection> = UI_SECTIONS as unknown as Record<string, UISection>;


export class ValidationOrchestrator implements IValidationOrchestrator {
  private readonly manager: ValidationManager;

  constructor(private readonly fso: FormStateOrchestrator) {
    this.manager = new ValidationManager();
  }

  /**
   * Implementatie van de interface: Valideert een sectie.
   * Hier moet later nog de logica komen die sectionId omzet naar fieldIds.
   */
  

  public validateSection(sectionId: string, formData: Record<string, unknown>): SectionValidationResult {
    // 1) Haal de sectie-config sterk getypeerd op
    const sectionCfg: UISection | undefined = UI_SECTIONS_MAP[sectionId];
  
    // 2) Bepaal de fieldIds voor deze section (zonder any + met type guard)
    const fields = Array.isArray(sectionCfg?.fields) ? sectionCfg!.fields : [];
    
const fieldIds: string[] = fields
.map((f: UISectionEntry) => (typeof f === 'string' ? f : f.fieldId))
.filter((fid): fid is string => typeof fid === 'string' && fid.length > 0);

  
    // 3) Filter formData naar alleen deze fields
    const subsetEntries = Object.entries(formData).filter(([fid]) => fieldIds.includes(fid));
  
    // 4) Valideer en bouw SectionValidationResult (strict-boolean compliant)
    const errorFields: string[] = [];
    const errors: Record<string, ValidationError> = {};
  
    for (const [fieldId, value] of subsetEntries) {
      const msg = this.validateField(fieldId, value); // string | null
      if (typeof msg === 'string' && msg.length > 0) { // ⬅ strict-boolean ok
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
  


  /**
   * Implementatie van de interface: Valideert een enkel veld.
   */
  public validateField(fieldId: string, value: unknown): string | null {
    return this.manager.validateField(fieldId, value);
  }
}
