// Centralized feature flags for controlled rollout of UX changes.
// Default all flags to false for safety. Flip to true per feature when ready.

/**
 * Controls visibility of the Wizard progress indicator (Phase 3).
 * When true, dots are rendered in WizardPage.
 */
export const showWizardProgress = true;

/**
 * Controls success feedback after save operations (Phase 3 follow-up).
 * When true, success toasts/alerts are shown after successful actions.
 */
export const showSuccessToasts = false;

// src/config/features.ts
export const features = {
  useTempWizard: true, // zet naar false om de oude te gebruiken
};
``;
