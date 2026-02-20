// src/app/config/features.ts
/**
 * @file_intent Beheert de runtime-configuratie en feature-toggles voor de applicatie-interface en functionele flows.
 * @repo_architecture Mobile Industry (MI) - Configuration Layer.
 * @term_definition showWizardProgress = Toggle voor de visuele voortgangsindicator in de wizard. useTempWizard = Flag om te schakelen tussen de experimentele (temp) en stabiele wizard-implementatie.
 * @contract Biedt een centrale plek voor conditionele logica in de UI en orchestrators. Hiermee kunnen features zoals toast-notificaties of specifieke wizard-onderdelen aan- of uitgezet worden zonder de code-structuur te wijzigen.
 * @ai_instruction Gebruik deze constanten om gefaseerde roll-outs te faciliteren. De PHOENIX_KEYS array is gereserveerd voor toekomstige integraties of specifieke licentie-sleutels binnen het Mobile Industry framework.
 */
export const showWizardProgress = true;
export const showSuccessToasts = false;
export const features = {
  useTempWizard: true, 
};
export const PHOENIX_KEYS = [];
