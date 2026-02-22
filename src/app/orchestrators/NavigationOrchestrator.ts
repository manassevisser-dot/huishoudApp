// src/app/orchestrators/NavigationOrchestrator.ts
/**
 * @file_intent Coördineert de navigatie-flow en schermovergangen.
 * @repo_architecture Mobile Industry (MI) - Application Flow Layer.
 * @term_definition activeStep = De huidige positie in de algemene app-flow. currentScreenId = De specifieke wizard-pagina.
 * @contract Stateless regisseur van beweging. Delegeert de berekening van de volgende stap aan de NavigationManager, maar voert de mutatie uit via de FSO.
 * @ai_instruction Gebruikt de ScreenRegistry voor metadata (next/prev). Combineert navigatie met validatie (canNavigateNext).
 */

import { ScreenRegistry } from '@domain/registry/ScreenRegistry';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { NavigationManager } from './managers/NavigationManager';
import type { IValidationOrchestrator } from './interfaces/IValidationOrchestrator';
import { logger } from '@adapters/audit/AuditLoggerAdapter';

export class NavigationOrchestrator implements INavigationOrchestrator {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly navigationManager: NavigationManager,
    private readonly validation: IValidationOrchestrator
  ) {}

  public navigateTo(screenId: string): void {
    const definition = ScreenRegistry.getDefinition(screenId);
    if (definition === null) {
      logger.warn('navigation_screen_not_found', {
        orchestrator: 'navigation',
        action: 'navigateTo',
        screenId,
      });
      return;
    }

    this.fso.dispatch({ type: 'SET_STEP', payload: screenId });

    if (definition.type === 'WIZARD') {
      this.fso.dispatch({ type: 'SET_CURRENT_SCREEN_ID', payload: screenId });
    }
  }

  // === WIZARD LOGICA (Bestand) ===

  public getCurrentScreenId(): string {
    return this.fso.getState().currentScreenId;
  }

  public canNavigateNext(): boolean {
    const currentId = this.getCurrentScreenId();
    const result = this.validation.validateSection(currentId, this.fso.getState().data);
    return result.isValid;
  }

  public navigateNext(): void {
    const currentId = this.fso.getState().activeStep;
    const definition = ScreenRegistry.getDefinition(currentId);

    // ESLint fix: Expliciete check op null/undefined/empty string
    if (definition !== null && definition.nextScreenId !== undefined && definition.nextScreenId !== '') {
      this.navigateTo(definition.nextScreenId);
    } else if (this.canNavigateNext()) {
      const nextId = this.navigationManager.getNextStep(currentId);
      if (nextId !== null && nextId !== '') {
        this.navigateTo(nextId);
      }
    }
  }

  // === MACRO NAVIGATIE (Aangepast naar Registry) ===

  public startWizard(): void {
    const firstScreen = this.navigationManager.getFirstScreenId();
    // ESLint fix: Check of de string niet leeg of null is
    if (firstScreen !== null && firstScreen !== '') {
      this.navigateTo(firstScreen);
    } else {
      this.navigateTo('WIZARD_SETUP_HOUSEHOLD');
    }
  }

  public goToDashboard(): void { this.navigateTo('DASHBOARD'); }
  public goToOptions(): void { this.navigateTo('OPTIONS'); }
  public goToSettings(): void { this.navigateTo('SETTINGS'); }
  public goToCsvUpload(): void { this.navigateTo('csv_UPLOAD'); }
  public goToReset(): void { this.navigateTo('RESET'); }

  public goBack(): void {
    const currentId = this.fso.getState().activeStep;
    const definition = ScreenRegistry.getDefinition(currentId);

    // ESLint fix: Expliciete check op previousScreenId
    if (definition !== null && definition.previousScreenId !== undefined && definition.previousScreenId !== '') {
      this.navigateTo(definition.previousScreenId);
    } else {
      this.navigateTo('DASHBOARD');
    }
  }

  public navigateBack(): void {
    this.goBack();
  }
}
