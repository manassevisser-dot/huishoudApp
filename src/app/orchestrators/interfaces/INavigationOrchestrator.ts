// src/app/orchestrators/interfaces/INavigationOrchestrator.ts
/**
 * Contract voor navigatie: schermovergangen en wizard flow-control.
 *
 * @module app/orchestrators/interfaces
 * @see {@link ./README.md | Interfaces — Details}
 */

export interface INavigationOrchestrator {
  // bestaand
  getCurrentScreenId(): string;
  canNavigateNext(): boolean;
  navigateNext(): void;
  navigateBack(): void;
  startWizard(): void;
  goToDashboard(): void;
  goToOptions(): void;
  goToSettings(): void;
  goToCsvUpload(): void;
  goToReset(): void;
  goToCsvAnalysis(): void;
  goToUndo(): void;
  goBack(): void;
}