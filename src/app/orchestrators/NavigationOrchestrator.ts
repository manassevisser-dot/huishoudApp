import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import type { IValidationOrchestrator } from './interfaces/IValidationOrchestrator';
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { NavigationManager } from './managers/NavigationManager';

export class NavigationOrchestrator implements INavigationOrchestrator {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly navigationManager: NavigationManager,
    private readonly validation: IValidationOrchestrator
  ) {}

  public getCurrentPageId(): string {
    // We halen de huidige pagina uit de state van de FSO
    return this.fso.getState().currentPageId;
  }

  public canNavigateNext(): boolean {
    const currentId = this.fso.getState().currentPageId;
    // Vraag aan de validatie of deze sectie oké is
    const result = this.validation.validateSection(currentId, this.fso.getState().data);
    return result.isValid;
  }

  public navigateNext(): void {
    if (this.canNavigateNext()) {
      const currentId = this.fso.getState().currentPageId; // 👈 Gebruik de juiste state-key
      const nextId = this.navigationManager.getNextStep(currentId);

      if (nextId !== null && nextId !== '') {
        // We rapporteren het feit dat de pagina moet veranderen naar de FSO
        this.fso.dispatch({ type: 'SET_CURRENT_PAGE_ID', payload: nextId });
      }
    }
  }

  public navigateBack(): void {
    const currentId = this.getCurrentPageId();
    const prevId = this.navigationManager.getPreviousStep(currentId);

    if (prevId !== null && prevId !== '') {
      this.fso.dispatch({ type: 'SET_CURRENT_PAGE_ID', payload: prevId });
    }
  }
}