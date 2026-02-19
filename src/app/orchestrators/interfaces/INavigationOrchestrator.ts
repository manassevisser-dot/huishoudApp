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
  goBack(): void;
}